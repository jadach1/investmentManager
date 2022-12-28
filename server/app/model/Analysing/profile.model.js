module.exports = (sequelize, Sequelize) => {

    const profile = sequelize.define('company_profile',{
            symbol: { type: Sequelize.STRING(10)},
            price: {type: Sequelize.DECIMAL(12, 2)},
            mktcap: {type: Sequelize.BIGINT.UNSIGNED},
            name: {type: Sequelize.STRING(100)},
            exchange: {type: Sequelize.STRING(100)},
            industry: {type: Sequelize.STRING(100)},
            sector: {type: Sequelize.STRING(100)},
            description: {type: Sequelize.TEXT('long')},
            employees: {type: Sequelize.INTEGER},
            image: {type: Sequelize.STRING(100)},
            ipo: {type: Sequelize.STRING(10)},
    })

    return profile;
}