
const { default: mongoose } = require('mongoose');
const Creator = require('../model/Creator.model');
const User = require('../model/User.model');
const ethers = require('ethers');
const IncentiveManagerABI = require('../../abis/IncentiveManager.json');
const {ALCHAMY_RPC_URL,INCENTIVE_MANAGER_CONTRACT_ADDRESS} = require('../config/constant');

const provider = new ethers.providers.JsonRpcProvider(ALCHAMY_RPC_URL);

const IncentiveManagerInst = new ethers.Contract(INCENTIVE_MANAGER_CONTRACT_ADDRESS, IncentiveManagerABI.abi, provider);


var monthId = 0;


const pong = async (req, res) => {
    res.send(`pong ${ID}`);
}

const getMonthID = async () => {

}

const onLogin = async (req, res) => {
    try{
        const { address, name } = req.body;
        let  userData = await User.findOne({address});
        monthId = await IncentiveManagerInst.currentMonth();
        const creatorData = await Creator.findOne({address,monthId});
        if(!userData) {
            user = new User();
            user.address = address;
            user.name = name;
            user.viewToken = 60;
            user.lastUpdate = Date.now();
            userData = user;
            user.save();
        }else {
            const timeDiff = Date.now() - userData.lastUpdate;
            const hours = timeDiff / 3600000;
            if(hours > 24) {
                userData.viewToken = 60;
                userData.lastUpdate = Date.now();
                userData.save();
            }
        }

        if(!creatorData) {
            creator = new Creator();
            creator.address = address;
            creator.name = name;
            creator.monthlyEarnings = 0;
            creator.monthId = monthId;
            creator.save();
        }


        res.status(200).json({
            status: 200,
            message: 'Login successful',
            data: {
                user: userData,
                creator: creatorData
            },
          });
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            message: 'Error Found',
            data: err,
          });
    }
    
}



const getCreator = async (req, res) => {

}
const viewContent = async (req, res) => {
    const { userAddress, creatorAddress } = req.body;

    try{
        //IF viewTokens are 0 then return error
        const userData = await User.findOne({address: userAddress});
        if(userData.viewToken === 0) {
            res.status(500).json({
                status: 500,
                message: 'No view tokens left',
                data: null,
                }); 
            return;
        }
        await Creator.findOneAndUpdate({address: creatorAddress,monthId},{$inc: {monthlyEarnings: 1}});
        await User.findOneAndUpdate({address: userAddress},{$inc: {viewToken: -1}});
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            message: 'Error Found',
            data: err,
          });
    }

}
const findIncentive = async (req, res) => {

}

const findIncentiveFactor = async (req, res) => {
}

module.exports = {pong, onLogin, getCreator, viewContent, findIncentive};