module.exports.cron = {
  cleanTokens: {
    schedule: '* * */1 * *',
    onTick: function () {
      console.log( 'Cleaning tokens', new Date() );
			AccessToken.destroy({
				expires: {
					"lessThan": new Date()
				}
			})
			.then( function( err, res ) {
				console.log( 'Clean result', err, res );
			})
    }
  }
};
