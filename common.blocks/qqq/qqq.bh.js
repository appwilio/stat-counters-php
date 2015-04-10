module.exports = function (bh) {
	bh.match('qqq', function (ctx) {
		ctx.content('qqq');
	});
}