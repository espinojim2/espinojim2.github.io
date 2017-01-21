var URL="";
//http://todothis.x10host.com/tasks/list?accountid=1
function setCont(n){
$('.msetcont').hide();
$('#setcont'+n).show();	
}

function addTask(){
setCont(2);	
$('#js_texttodo').val("");
}

function pm_back(){
setCont(1);		
}

function recycle_task_list(){
var accountid=localStorage.getItem('accountid');
$.ajax({
    url: "http://todothis.x10host.com/tasks/list/recyclable?accountid="+accountid,
    dataType: "jsonp",
    contentType: "application/json; charset=utf-8",
    success: function(data)
    {
    var str="";
    for(var x=0;x<data.length;x++){
    str+="<div style='padding:3% 5% 7% 5%; font-size:14px; margin-bottom:3%; border:solid 1px rgba(0,0,0,0.2);'>";
    str+="<input type='hidden' id='ttaskid"+x+"' value='"+data[x].id+"'/>";
   

 str+="<center><b>"+(data[x].task)+"</b></center>";
    str+="<button onclick='dbltapmsg()' ondblclick='restoreTask("+x+")' title='Restore' style='float:left; background:rgba(0,0,0,0); border:none; margin-top:-20px;'> <iron-icon icon=\"refresh\"></iron-icon></button>";
    str+="<button onclick='dbltapmsg()' ondblclick='totalyremoveTask("+x+")' title='Remove' style='float:right; background:rgba(0,0,0,0); border:none; margin-top:-20px;'> <iron-icon icon=\"close\"></iron-icon></button>";
    str+="</div>";	
    }
    $('#recycle_cont').html(str);
     if(data.length==0){
      $('#recycle_cont').html("<h4>No results Found</h4>");
    }
    }
}).fail(function() {
 app.$.toast.text = 'Failed';
  app.$.toast.show();

 });



}

function pm_setTasklist(){
  var accountid=localStorage.getItem('accountid');
$.ajax({
    url: "http://todothis.x10host.com/tasks/list?accountid="+accountid,
    dataType: "jsonp",
    contentType: "application/json; charset=utf-8",
    success: function(data)
    {
    var str="";
    for(var x=0;x<data.length;x++){
    str+="<div style='padding:3% 5% 6% 3%; font-size:14px; margin-bottom:3%; border:solid 1px rgba(0,0,0,0.2);'>";
    str+="<input type='hidden' id='taskid"+x+"' value='"+data[x].id+"'/>";
    str+="<b>"+(data[x].task)+"</b>";
    str+="<button onclick='dbltapmsg()' ondblclick='removeTask("+x+")' title='Remove' style='float:right; background:rgba(0,0,0,0); border:none;'> <iron-icon icon=\"close\"></iron-icon></button>";
    str+="</div>";	
    }
    $('#taskscont1').html(str);
    if(data.length==0){
      $('#taskscont1').html("<h4>No results Found</h4>");
    }
    }
}).fail(function() {
 app.$.toast.text = 'Failed';
  app.$.toast.show();

 });

}


function removeTask(x){
var id=$('#taskid'+x).val();	

$.ajax({
    url: "http://todothis.x10host.com/tasks/delete/"+id,
  //  dataType: "jsonp",
   // contentType: "application/json; charset=utf-8",
    success: function(data)
    {

     if(data==''){
 app.$.toast.text = "Done Deleting";
  app.$.toast.show();
setCont(1);	
pm_setTasklist();
}
    }
}).fail(function() {
 app.$.toast.text = 'Failed';
  app.$.toast.show();

 });

}




function totalyremoveTask(x){
var id=$('#ttaskid'+x).val();  

$.ajax({
    url: "http://todothis.x10host.com/tasks/delete/totaly/"+id,
  //  dataType: "jsonp",
   // contentType: "application/json; charset=utf-8",
    success: function(data)
    {
     
     if(data==''){
 app.$.toast.text = "Done Deleting";
  app.$.toast.show();
setCont(1); 
recycle_task_list();
pm_setTasklist();
}
    }
}).fail(function() {
 app.$.toast.text = 'Failed';
  app.$.toast.show();

 });

}




function restoreTask(x){
var id=$('#ttaskid'+x).val();  

$.ajax({
    url: "http://todothis.x10host.com/tasks/delete/restore/"+id,
  //  dataType: "jsonp",
   // contentType: "application/json; charset=utf-8",
    success: function(data)
    {
     
     if(data==''){
 app.$.toast.text = "Done Restoring";
  app.$.toast.show();
setCont(1); 
recycle_task_list();
pm_setTasklist();
}
    }
}).fail(function() {
 app.$.toast.text = 'Failed';
  app.$.toast.show();

 });


}


function dbltapmsg(){
app.$.toast.text = 'Double tap to activate';
  app.$.toast.show();

}


function logoutP(){
localStorage.setItem('accountid','');
window.location.href="http://todothis.x10host.com/todo/index.html";
}

function pm_saveTask(){
var tasktext=$('#js_texttodo').val();
  var accountid=localStorage.getItem('accountid');

$.ajax({
    url: "http://todothis.x10host.com/tasks/add/"+tasktext+"?accountid="+accountid,
  //  dataType: "jsonp",
   // contentType: "application/json; charset=utf-8",
    success: function(data)
    {
     if(data=='Success'){
 app.$.toast.text = data;
  app.$.toast.show();
setCont(1);	
pm_setTasklist();
}
    }
}).fail(function() {
 app.$.toast.text = 'Adding Failed, make sure to input your Task';
  app.$.toast.show();

 });



}



function setMyUserPass(){
var accountid=localStorage.getItem('accountid');

$.ajax({
    url: "http://todothis.x10host.com/tasks/accountdata?accountid="+accountid+"&callback",
   dataType: "jsonp",
  contentType: "application/json; charset=utf-8",
    success: function(data)
    {

  if((data).length>0){
    $('#username1').val(data[0].username);
    $('#password1').val(data[0].password);
    $('#my_accountid').val(accountid);
  }
}
    
}).fail(function() {
 app.$.toast.text = 'Failed';
  app.$.toast.show();

 });


}


function app_updateAccount(){
var user=$('#username1').val();
var pass=$('#password1').val();
 
var accountid=localStorage.getItem('accountid');

$.ajax({
    url: "http://todothis.x10host.com/tasks/account/update?accountid="+accountid+"&user="+user+"&pass="+pass,
  //  dataType: "jsonp",
   // contentType: "application/json; charset=utf-8",
    success: function(data)
    {
    
     if(data==''){
 app.$.toast.text = "Update Successfull";
  app.$.toast.show();
}
else{
 app.$.toast.text = 'Update Failed, try another username';
  app.$.toast.show(); 
}
    }
}).fail(function() {
 app.$.toast.text = 'Update Failed, try another username';
  app.$.toast.show();

 });



}