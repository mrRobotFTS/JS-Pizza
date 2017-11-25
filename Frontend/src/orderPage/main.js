$(function(){
    //This code will execute when the page is ready

    $("#inputPhone").keyup(function () {
        var Value = $(this).val();
        var flag= true;

        var l = Value.length;
        if(l>=1&&(Value[0]!="0"&&Value[0]!='+'))flag = false;
        if(l<6||l>14)flag = false;
        for(var i=1;i<l;i++) if(!(Value[i]>='0'&&Value[i]<='9'))flag=false;

        if(!flag){
            $(".phoneForm").addClass("has-error");
            $(".phoneForm").removeClass("has-success");
            $(".uncorrectPhone").removeClass("displayNone");
        }
        else  {
            $(".phoneForm").removeClass("has-error");
            $(".phoneForm").addClass("has-success");
            $(".uncorrectPhone").addClass("displayNone");
        }
    });

    $("#inputName").keyup(function () {
        var Value = $(this).val();
        var flag= true;

        var l = Value.length;
        for(var i=0;i<l;i++) if((Value[i]>='0'&&Value[i]<='9'))flag=false;

        if(!flag){
            $(".nameForm").addClass("has-error");
            $(".nameForm").removeClass("has-success");
            $(".uncorrectName").removeClass("displayNone");
        }
        else  {
            $(".nameForm").removeClass("has-error");
            $(".nameForm").addClass("has-success");
            $(".uncorrectName").addClass("displayNone");
        }
    });


});