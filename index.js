const app = require('./app/app');
const config = require('./app/config/configuration.json');

const port = config.server.port;

/*
 * @description Listen Server at configured port
 * @event App Listener
 */
app.listen(port, () => {
    // eslint-disable-next-line no-console
    const banner = `
    ######          #####                              
    #     # ###### #     # #    #   ##   #####  ###### 
    #     # #      #       #    #  #  #  #    # #      
    #     # #####   #####  ###### #    # #    # #####  
    #     # #            # #    # ###### #####  #      
    #     # #      #     # #    # #    # #   #  #      
    ######  ######  #####  #    # #    # #    # ###### 
                                                       
    `;
    // eslint-disable-next-line no-console
    console.log(`${banner}\nDeshare server on port ${port}`);
});