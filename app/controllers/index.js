
const { default: mongoose } = require('mongoose');
const Creator = require('../model/Creator.model');
const User = require('../model/User.model');
const ethers = require('ethers');
const IncentiveManagerABI = require('../../abis/IncentiveManager.json');
const {
    ALCHAMY_RPC_URL,
    INCENTIVE_MANAGER_CONTRACT_ADDRESS,
    FOLLOWER_CONSTANT,
    POST_CONSTANT,
    ADMIN_PRIVATE_KEY
} = require('../config/constant');

const provider = new ethers.providers.JsonRpcProvider(ALCHAMY_RPC_URL);
const signer = new ethers.Wallet(ADMIN_PRIVATE_KEY,provider);

const IncentiveManagerInst = new ethers.Contract(INCENTIVE_MANAGER_CONTRACT_ADDRESS, IncentiveManagerABI.abi, provider);


var monthId = 0;


const pong = async (req, res) => {
    monthId = await IncentiveManagerInst.currentMonth();

    res.send(`pong ${monthId}`);
}

const calculateIncentiveScore  =  (totalViews,followers,posts) => {
    // incentiveScore = (totalViews / creator.follower) + followers/FOLLOWER_CONSTANT + post / POST_CONSTANT;

    const incentiveScore = (totalViews / followers) + followers/FOLLOWER_CONSTANT + posts / POST_CONSTANT;
    return incentiveScore;


}

const onLogin = async (req, res) => {
    try{
        const { address, name } = req.body;
        let  userData = await User.findOne({address});
        monthId = await IncentiveManagerInst.currentMonth();
        let creatorData = await Creator.findOne({address,monthId});
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
                await userData.save();
            }
        }


            if(!creatorData) {
                creator = new Creator();
                creator.address = address;
                creator.name = name;
                creator.monthlyEarnings = 0;
                creator.monthId = monthId;
                creatorData = await creator.save();
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

        //if userAddress === creatorAddress then return error
        if(userAddress === creatorAddress) {
            res.status(200).json({
                status: 200,
                message: 'User and creator are same',
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
    const { creatorAddress, followers, post  } = req.body;
    const creatorData = await Creator.findOne({address: creatorAddress,monthId : +monthId-1});
    const incentiveScore = calculateIncentiveScore(creatorData.monthlyEarnings,followers,post);
    const signature = await signer.signMessage(incentiveScore.toString());
    res.status(200).json({
        status: 200,
        message: 'Incentive Score',
        data: {
            incentiveScore,
            signature
        },
    });
}

const findIncentiveFactor = async (req, res) => {
    const allData = await Creator.find({monthId});
    const totalIncentiveScore = allData.reduce((acc,curr) => {
        return acc + curr.monthlyEarnings;
    },0);
    return res.status(200).json({
        status: 200,
        message: 'Incentive Factor',
        data: {
            incentiveFactor: totalIncentiveScore
        },
    });

}

const getIncentiveData = async (req,res) => {
    const { address,monthId } = req.query;
    console.log(address,monthId);
    // if address and monthID is null return error

    if(!address || !monthId){
        res.status(500).json({
            status: 500,
            message: 'address and monthID required ',
          });
    }

    const data = await Creator.findOne({address,monthId});
    return res.status(200).json({
        status: 200,
        message: 'Incentive Data fetch successfully',
        data: data,
    });
    
}

module.exports = {
    pong, 
    onLogin, 
    getIncentiveData,
    viewContent, 
    findIncentive,
    findIncentiveFactor
};