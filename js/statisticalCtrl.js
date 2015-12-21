// JavaScript Document

//定义用户的输入项
var mTopicId=1;
var mItemId=2;
var mUserId='354273055815695';
//查询到的topicId=mTopicId的全部项
var queryDatas=new Array();
//我的选择
var mychoice;
//转码表
var Codelist={0:'中立',1:'赞',2:'弹'};

//统计结果数组
var countArray=new Array();

var findTopic=function()
{
	init();
	
	showResult0();
	//alert(mTopicId);
	findData('Topic',mTopicId);
	findMyChoice('ActionStatistics',mUserId,mTopicId,mItemId);
	
	//统计
	setTimeout(getCountAll,500);
	
	//打印结果
	setTimeout(showResult2,800);

	
	
}
//查询我的选择
var findMyChoice=function(table,user,topicString,itemid){
	var ResultData = Bmob.Object.extend(table);
	var query = new Bmob.Query(ResultData);
	//query.select('action');
	query.equalTo('userId',user);
	query.equalTo('topicId',topicString);
	query.equalTo('itemId',itemid);
	query.find({
    	success: function(results) {
			
			mychoice=results[0].get('action');
			//打印结果
			showResultMe(mychoice);
    	},
    		error: function(error) {
        	alert("查询失败: " + error.code + " " + error.message);
    	}
	
});
}




//查询topicId 的图文结果
var findData=function(table,topicString){
	
	if(queryDatas==''){
	var ResultData = Bmob.Object.extend(table);
	var query = new Bmob.Query(ResultData);
	//var datas=new Array();
	query.equalTo('topicId', topicString); 
	// 查询所有数据
	query.find({
    	success: function(results) {
        	
        	for (var i = 0; i < results.length; i++) {
        	var object = results[i];
			var obj=object['attributes'];
			queryDatas.push(obj);
			
			//打印结果
			//showResult();
			
        	}
    	},
    		error: function(error) {
        	alert("查询失败: " + error.code + " " + error.message);
    	}
	});	
	
	}
}

var getCountAll=function(){
	for (var j=0;j<queryDatas.length;j++){
		var nowItemId=queryDatas[j].itemId;
		getCount(mTopicId,nowItemId);
	}
	
}
//统计结果
var getCount=function(topicString,itemId){
	
	
	var ResultData = Bmob.Object.extend('ActionStatistics');
	var query = new Bmob.Query(ResultData);
	
	query.equalTo('topicId',topicString);
	
	query.equalTo('itemId',itemId);
	
	query.find({
 	 success: function(results) {
    	// 查询成功，返回记录数量
    	
		var count0=0;
		var count1=0;
		var count2=0;
		for (var i = 0; i < results.length; i++) {
        	var object = results[i];
		
			var ac=object.get('action');
			
			switch(ac){
			case 0:
				count0=count0+1;
				break;
			case 1:
				count1=count1+1;
				break;
			case 2:
				count2=count2+2;
				break;
			}
			
		}
		var actionArr=new Array(count0,count1,count2);
		var actionObj=new Object();
		actionObj.itemId=itemId;
		actionObj.arr=actionArr;
		countArray.push(actionObj);
		
  	},
  	error: function(error) {
    	// 查询失败
  	}
	});
}

		
var showResult=function(){
	$('#divTitle').empty();
	$('#divTitle').append('<p>题目序号为'+mTopicId+'的所有子项：（Topic表）</p>');
	for(var i=0;i<queryDatas.length;i++){
		var object=queryDatas[i];
		
		$('#divTitle').append('<p>子项:'+object.itemId+'</p>');
	    $('#divTitle').append('<p>图片:'+object.imgName+'，  文字：'+object.txt+'</p>');
	}

}
var showResult2=function(){
	for(var i=0;i<countArray.length;i++)
	{
		var itemObj=countArray[i];
		var object=queryDatas[i];
		
		$('#divResult').append('<p>子项'+itemObj.itemId+'</p>');
		$('#divResult').append('<p>图片:'+object.imgName+'，  文字：'+object.txt+'</p>');
		 
		jQuery('<canvas>').attr('id', 'chartCanvas'+i).attr('width',400).attr('height',200).appendTo("#divResult");
		
		var chart = new AwesomeChart('chartCanvas'+i);
            chart.chartType = "horizontal bars";
            chart.data = itemObj.arr;
            chart.labels = ['中立','赞','弹'];
			chart.width=150;
			chart.height=150;
			chart.margnTop=5;
			chart.margnBottom=5;
            chart.colors = ['#006CFF', '#FF6600', '#34A038'];
            chart.randomColors = true;
            chart.draw();
	}
	
}

var getJGjson=function(obj){
	var dataArray=new Array();
	for(var i=0;i<obj.length;i++){
		var itemObj=obj[i];
		dataArray.push(itemObj.arr);
	}
	return dataArray;
}
var getAxisLabel=function(obj){
	var dataArray=new Array();
	for(var i=0;i<obj.length;i++){
		var itemObj=obj[i];
		dataArray.push('子项'+itemObj.itemId);
	}
	return dataArray;
}

var showResult0=function(){
	$('#divInput').empty();
	$('#divInput').append('<p>从URL中输入的参数</p>');
	$('#divInput').append('<p>题目序号：'+mTopicId+'，    选项序号：'+mItemId+'，    用户id：'+mUserId+'</p>');
	$('#divInput').append('<p>==============================</p>');
	}
var showResultMe=function(mc){
	$('#divMe').empty();
	$('#divMe').append('<p>我的选择：'+Codelist[mc]+'</p>');
	$('#divMe').append('<p>==============================</p>');
}

