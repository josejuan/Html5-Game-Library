/*
Copyright (c) 2011, Yubo Dong @ www.jswidget.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the jswidget.com nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,  BUT NOT LIMITED TO,  THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS  FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN  NO  EVENT  SHALL  JSWIDGET.COM BE LIABLE FOR ANY DIRECT,
INDIRECT,   INCIDENTAL,   SPECIAL,  EXEMPLARY,  OR  CONSEQUENTIAL   DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR  TORT
(INCLUDING  NEGLIGENCE  OR  OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function EasyComment(){
   this.commentUL = null;
}

EasyComment.prototype.init = function(container,path,moderate,nHeight,bHasSubject, bEmail, bSite, nMaxReply,countPerPage){
   this.moderate = moderate ? 1 : 0;
   this.maxReply = nMaxReply;
   this.currentPage = 0;
   this.countPerPage = countPerPage; // 0: no paging

   this.path = path;

   if ( container ){
      this.container = container;
   }else{
      $("body").append(this.container = $("<div id='ec-page'></div>")[0]);
   }
   if ( nHeight !== null ){
      if ( nHeight === "" || isNaN(nHeight) ){
         $(this.container).css("height","auto");
      }else{
         $(this.container).css("height",nHeight + "px");
      }
   }
   this.hasSubject = (bHasSubject === true)?true:false;
   this.hasEmail   = (bEmail === true)?true:false;
   this.hasSite    = (bSite === true)?true:false;

   $(this.container).addClass("ec-comment-pane")
      .append(
         this.totalComment = $("<div class='ec-total'></div>").html("Be the first person to leave a comment")[0]
      );
   if ( this.countPerPage > 0 ){
      $(this.container).append(this.paging = $("<div class='ec-paging'></div>")[0]);
   }

   $(this.container).append(
      this.commentUL = $("<ul></ul>").addClass("ec-comment-list")[0]
   );


   var _this = this;
   $(this.container).find("button[name=reply]").live("click",function(){
      var id = $(this).attr("id").split("_")[1];
      $(_this.replyFormContainer).find("button[name=submit_reply]")
         .data("reply_id",id);

      var pos = $(this).offset(),h = $(this).outerHeight();
      var left = pos.left, top = pos.top + h;
      _this.showReplyForm(left,top);
   });

   this.addCmtForm();
   this.addReplyForm();
   var w = $(this.commentForm).width();
   if ( w > 500 ){
      $(this.commentForm).width(500);
      $(this.replyForm).width(500);
   }
   this.loadComment(0);
};
EasyComment.prototype._getFormFields = function(){
   return   '<fieldset>'+
            '<legend>Your name:<span title="Required field" style="color:red;">*</span></legend>'+
            '<input type="text" style="width:100%" value="" name="name">'+
            '</fieldset>'+
            (( this.hasSubject )?(
            '<fieldset>'+
            '<legend><span style="color:red;margin-right:5px;"></span>Subject:</legend>'+
            '<input type="text" style="width:100%" value="" name="subject">'+
            '</fieldset>'):"")+

            (( this.hasEmail )?(
            '<fieldset>'+
            '<legend><span style="color:red;margin-right:5px;"></span>Email:</legend>'+
            '<input type="email" style="width:100%" value="" name="email">'+
            '</fieldset>'):"")+

            (( this.hasSite )?(
            '<fieldset>'+
            '<legend><span style="color:red;margin-right:5px;"></span>Web Site:</legend>'+
            '<input type="url" style="width:100%" value="" name="site">'+
            '</fieldset>'):"")+

            '<fieldset>'+
            '<legend>Comment:<span title="Required field" style="color:red;margin-right:5px;">*</span></legend>'+
            '<div style="vertical-align:top;">'+
            '<textarea style="width:100%;height:180px;" name="message" type="text"></textarea>'+
            '</div>'+
            '</fieldset>';
};
EasyComment.prototype.addCmtForm = function(){
   var _this = this;
   var arrForm = [
            '<div class="ec-comment-form">',
            '<form method="post" name="ec-comment-form">',
            '<fieldset>',
            '<legend class="title">Leave your comment here</legend>',
            this._getFormFields(),

            '<div style="text-align:right;position:relative;">',
            '<div style="position:absolute;left:0px;bottom:0px;color:#444488;font:11px arial;">Powered by <a href="http://www.jswidget.com/lab/easy-comment.html" target="_blank">EasyComment</a></div>',
            '<button name="submit">Submit</button>&nbsp;&nbsp;&nbsp;',
            '</div>',
            '</fieldset>',
            '</form>',
            '</div>'
   ];
   $(this.container).append(arrForm.join(""));
   this.commentForm = $(this.container).find(".ec-comment-form form[name=ec-comment-form]")[0];

   $(this.commentForm).find("button[name=submit]").click(function(){
      _this.submitMessage(_this.commentForm,false,"");
      return false;
   });
   return this;
};

EasyComment.prototype.addReplyForm = function(){
   var arrForm = [
      '<div class="ec-comment-form ec-comment-reply-form" style="display:none;">',
      '<div class="close_button"></div>',
      '<form method="post" name="ec-comment-reply-form">',
      '<fieldset>',
      this._getFormFields(),
      '<div style="text-align:right;position:relative;">',
      '<button name="submit_reply">Reply</button>&nbsp;&nbsp;&nbsp;',
      '<button class="close_button">Close</button>&nbsp;&nbsp;&nbsp;',
      '</div>',
      '</fieldset>',

      '</form>',
      '</div>'
   ];
   $("body").append(this.replyFormContainer = $(arrForm.join(""))[0]);

   this.replyForm = $(this.replyFormContainer).find("form[name=ec-comment-reply-form]")[0];


   var _this = this;

   $(this.replyFormContainer).find(".close_button").click(function(){
      _this.hideReplyForm();
      return false;
   });
   $(this.replyFormContainer).find("button[name=submit_reply]").click(function(){
      var id = $(this).data("reply_id");
      _this.submitMessage(_this.replyForm,true,id);
      return false;
   });

   return this;
};

EasyComment.prototype._renderComment = function(arrLI,parent_id){
   var i;
   /*if ( !this.commentUL ){
      $(this.paging).after(
         this.commentUL = $("<ul></ul>").addClass("ec-comment-list")[0]
      );
      for ( i = 0; i < arrLI.length; i ++ ){
         $(this.commentUL).append(arrLI[i]);
      }
   }else{*/
      var _this = this;
      for ( i = 0; i < arrLI.length; i ++ ){
         if ( parent_id === "" ){
            $(this.commentUL).prepend(
               arrLI[i]
            );
         }else{
            //look for nested ul
            var ul = $(this.commentUL).find("#" + parent_id + " ul")[0];
            if ( !ul ){
               $(this.commentUL).find("#" + parent_id).append(ul = $("<ul></ul>").addClass("ec-comment-list")[0]);
            }
            $(ul).prepend(arrLI[i]);
         }
      }
   //}
};

EasyComment.prototype._registerReply = function(btn){
   var _this = this;
   $(btn).live("click",function(){
      var id = $(this).attr("id").split("_")[1];
      $(_this.replyFormContainer).find("button[name=submit_reply]")
         .data("reply_id",id);

      var pos = $(this).offset(),h = $(this).outerHeight();
      var left = pos.left, top = pos.top + h;
      _this.showReplyForm(left,top);
   });
};
EasyComment.prototype.showReplyForm = function(left,top){
      $(this.replyFormContainer)
         .css({"left":left + "px",
               "top":top + "px",
               "opacity":0,
               "display":""})
         .animate({"opacity":1},300);
};
EasyComment.prototype.hideReplyForm = function(){
      $(this.replyFormContainer)
         .animate({"opacity":0},300,function(){$(this).css("display","none");});
};

EasyComment.prototype.submitMessage = function(form,bReply,parent_id){
   var data = {
      flag     : "1",
      domid    : $(this.container).attr("id"),
      title    : document.title,
      id       : bReply ? parent_id : "",
      moderate : this.moderate,
      max      : this.maxReply,
      path     : this.path,
      url      : this.getPageURL(),
      name     : $.trim($(form).find("input[name=name]").val()),
      subject  : (this.hasSubject)?$.trim($(form).find("input[name=subject]").val()):"",
      email    : (this.hasEmail)?$.trim($(form).find("input[name=email]").val()):"",
      site     : (this.hasSite)?$.trim($(form).find("input[name=site]").val()):"",
      message  : $.trim($(form).find("textarea[name=message]").val())
   };

   if ( data.name === "" ){
      $(form).find("input[name=name]").focus();
      return;
   }
   if ( data.message === "" ){
      $(form).find("textarea[name=message]").focus();
      return;
   }
   var _this = this;
   $.ajax({
      url:this.path + "ec-comment.php",
      data:data,
      dataType:"json",
      type:"POST",
      cache:false,
      success:function(data){
         if ( data ){
            _this._renderComment([data.comment],parent_id);
            var tc = $(_this.totalComment).data('total-comment');
            if ( parent_id === "" ){
               tc ++;
            }else{
               _this.hideReplyForm();
            }
            _this.showTotalComment(tc);

            alert("Message has been sent!\n\nThank you!");
            $(form).find("textarea[name=message]").val("");
            document.location.href = '#comments_section';

         }
      },
      error:function(s){
      }
   });
};
EasyComment.prototype.getPageURL = function(){
   var sURL = location.href;
   //
   // to avoid confusion
   //
   sURL = sURL.replace(/www\./,"");

   if ( sURL.indexOf("#") != -1 ){
      var s = sURL.split("#");
      sURL = s[0];
   }
   if ( sURL.indexOf("?") != -1 ){
      var s = sURL.split("?");
      sURL = s[0];
   }
   return sURL;
};
EasyComment.prototype.loadComment = function(pageNo){
   var data = {
      flag      : "2",
      max       : this.maxReply,
      domid     : $(this.container).attr("id"),
      url       : this.getPageURL(),
      pageno    : (pageNo)?pageNo:0,
      pagecount : this.countPerPage
   };
   this.currentPage = pageNo;

   var _this = this;
   $.ajax({
      url:this.path + "ec-comment.php",
      data:data,
      dataType:"json",
      type:"POST",
      cache:false,
      success:function(data){
         if ( data ){
            if ( data.total_comment > 0 ){
               $(_this.commentUL).empty();
               _this._renderComment(data.comments,"");
            }
            _this.showTotalComment(data.total_comment);
            _this.showPaging(data.total_comment);
         }
      },
      error:function(s){
      }
   });
};
EasyComment.prototype.showTotalComment = function(nTotal){
   var sHTML = nTotal + " Comments ";

   $(this.totalComment).html(sHTML)
      .data("total-comment",nTotal);
};
EasyComment.prototype.showPaging = function(nTotal){
   if ( this.countPerPage > 0 && nTotal > this.countPerPage ){
      $(this.paging).empty();
      var total_page = Math.ceil(nTotal / this.countPerPage);
      var _this = this;
      var nRest = nTotal - (this.currentPage+1) * this.countPerPage;
      var sNext = "";
      if ( nRest > this.countPerPage ){
         sNext = "Next " + this.countPerPage + " comments";
      }else{
         if ( nRest < 0 ){nRest = this.countPerPage;}
         sNext = "Next " + nRest + " comments";
      }
      //if ( this.currentPage != 0 ){
         $(this.paging)
            .append(
               $("<button></button>").html("Previous " + this.countPerPage + " comments")
                  .data("page_no",this.currentPage)
                  .attr("disabled",(this.currentPage == 0))
                  .click(function(){
                     _this.loadComment($(this).data("page_no")-1);return false;
                  })
            );
      //}

      //if ( this.currentPage < total_page - 1 ){
            $(this.paging)
               .append(
                  $("<button></button>").html(sNext)
                  .data("page_no",this.currentPage)
                  .attr("disabled",(this.currentPage == total_page - 1))
                  .click(function(){
                     _this.loadComment($(this).data("page_no")+1);return false;
                  })
               );
      //}
   }
};

(function($){
   $.fn.EasyComment = function(options){
      var settings = {
         path         : "/easy-comment/",
         maxReply     : 5,
         moderate     : false,
         height       : null,
         hasSubject   : false,
         hasEmail     : false,
         hasSite      : false,
         countPerPage : 10
      };
      if ( options ) {
         $.extend( settings, options );
      }
      addStyle(settings.path);
      return this.each(function(){
         var cp = new EasyComment()
            .init(
              this,
              settings.path,
              settings.moderate,
              settings.height,
              settings.hasSubject,
              settings.hasEmail,
              settings.hasSite,
              settings.maxReply,
              settings.countPerPage
            );
      });
      function addStyle(path){
         if ( $.fn.EasyComment.StyleReady ){
            return;
         }
         $.fn.EasyComment.StyleReady = true;
         var arrStyle = [
            "<style type='text/css'>",
            ".ec-comment-pane{position:relative; padding-left:20px; margin:5px 0; overflow:auto}",
            ".ec-comment-pane div.ec-total{font:1.3em Georgia; height:24px; line-height:24px}",
            ".ec-comment-pane div.ec-paging{height:30px; line-height:30px;text-align:right;}",
            ".ec-comment-pane div.ec-paging>button{font:13px arial;height:30px; line-height:30px;margin-right:10px;}",
            ".ec-comment-pane ul.ec-comment-list{position:relative; font-family:'Lucida Grande',sans-serif; font-size:14px; line-height:16px; list-style-type:none; padding:0px; background-color:#FFF; border:0px solid #14a1cc; border-radius:12px; overflow:auto}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment{position:relative; min-height:48px; min-width:48px; padding:4px 4px 12px 56px; margin-bottom:8px; border-radius:4px; font-size:9pt arial}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment:last-child{border:none; padding-bottom:0px}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment button{font:11px arial}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment a, ",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment .author{font-weight:bold; color:#2276bb; text-decoration:none}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment a:hover{text-decoration:underline}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment div.avatar{position:absolute; top:0px; left:0px; width:48px; height:48px; border:none; margin-top:6px; margin-left:2px; border-radius:4px; text-overflow:ellipsis; background:url(" + path + "ec-comment.png)}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment span.user-name{font-weight:bold; margin-right:0.5em; text-overflow:ellipsis}",
            ".ec-comment-pane ul.ec-comment-list li.ec-comment span.comment-time{font-size:11px; color:#999; line-height:16px; text-overflow:ellipsis}",
            ".ec-comment-form{font:1em Georgia}",
            ".ec-comment-form form{margin:0; padding:0}",
            ".ec-comment-form form input, .ec-comment-form form textarea, .ec-comment-form form button{font:1em arial}",
            ".ec-comment-form fieldset{ background:-webkit-gradient(linear,0 0,0 bottom,from(#ffffff),to(#dddddd));  background:-moz-linear-gradient(#ffffff,#dddddd);  background:linear-gradient(#ffffff,#dddddd);  filter :progid:DXImageTransform.Microsoft.Gradient(GradientType=0,startColorstr=#ffffff,endColorstr=#dddddd)}",
            ".ec-comment-form fieldset legend{ background:-webkit-gradient(linear,0 0,0 bottom,from(#ffffff),to(#dddddd));  background:-moz-linear-gradient(#ffffff,#dddddd);  background:linear-gradient(#ffffff,#dddddd);  filter :progid:DXImageTransform.Microsoft.Gradient(GradientType=0,startColorstr=#ffffff,endColorstr=#dddddd);  padding:0px 5px;  border-radius:6px;  border:1px solid #ccc}",
            ".ec-comment-form .title{ color:#444;  line-height:30px}",
            ".ec-comment-form fieldset{ border-radius:6px}",
            ".ec-comment-form fieldset fieldset{ border:none;  background:none;  filter:none}",
            ".ec-comment-form fieldset fieldset legend{ background:none;  border:none;  filter:none}",
            ".ec-comment-reply-form{position:absolute; left:0px; top:0px; height:400px}",
            ".ec-comment-reply-form div.close_button{ position:absolute;  right:-18px; top:-18px;  width:36px; height:36px;  background:url(" + path + "ec-close_box.png) no-repeat;  cursor:pointer}",
            "</style>"
         ];
         $(arrStyle.join("")).appendTo("head");
      }
   };
})(jQuery);
