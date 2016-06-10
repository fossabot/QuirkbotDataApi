module.exports.cron = {
  cleanTokens: {
    schedule: '* * */1 * *',
    onTick: function () {
      console.log( 'Cleaning access tokens', new Date() );
			AccessToken.destroy({
				expires: {
					"lessThan": new Date()
				}
			})
			.then( function( err, res ) {
				console.log( 'Cleaning access tokens', err, res );
			})
    }
  },
  cleanRefresh: {
    schedule: '* * */1 * *',
    onTick: function () {
      console.log( 'Cleaning refresh tokens', new Date() );
			RefreshToken.destroy({
				expires: {
					"lessThan": new Date()
				}
			})
			.then( function( err, res ) {
				console.log( 'Cleaning refresh tokens result', err, res );
			})
    }
  }
};
