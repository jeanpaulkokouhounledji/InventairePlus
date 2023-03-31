$.ajax({
	url: '/article/liste/highChart',
	success: function(result){
		var qteStock = JSON.parse(result).qteStock;
		var designation = JSON.parse(result).designation;
		drawLineChart(designation, qteStock);
	}
})

function drawLineChart(designation, qteStock){
	Highcharts.chart('article', {
		chart:{
			type: 'line',
			width: 450
		},
		title: {
			text: 'Liste des articles'
		},
		xAxis: {
			categories: designation
		},
		tooltip: {
			formatter: function(){
				return '<strong>'+ this.x +': </strong>'+this.y;
			}
		},
		series: [{
			data: qteStock
		}] 
	});
}