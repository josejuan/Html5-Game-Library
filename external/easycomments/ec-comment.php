<?php
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
if ( !(
        isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ) {
  die("Call not allowed");
}

//
// Change this email to the real moderator's email
//
$moderator_email = "jbarco@computer-mind.com";

$flag  = processText($_POST["flag"]);
if ( $flag === "1" ){
   add_comment($moderator_email);
}
if ( $flag === "2" ){
   read_comment();
}

function strleft($s1, $s2){
   return substr($s1, 0, strpos($s1, $s2));
}
function add_comment($moderator_email){

   $caller        = strtolower($_POST["url"]); //$_SERVER['HTTP_REFERER'];
   $filename      = md5($caller);
   $abs_comment_file = '/home/s080de29/public_html/log/' . $filename . '.xml';
   $date_value    = time();
   $comment_id    = $date_value . '-' . rand(1,100000000);
   $author_value  = processText($_POST["name"]);
   $subject_value = trim(processText($_POST["subject"]));
   $msg_value     = processText($_POST["message"]);
   $email         = processText($_POST["email"]);
   $site          = processText($_POST["site"]);
   $title         = processText($_POST["title"]);
   $parent_id     = processText($_POST["id"]);
   $dom_id        = processText($_POST["domid"]);
   $moderate      = 0; // processText($_POST["moderate"]); // 0 No moderate, 1: waiting for moderate 2: trash 3: spamn 4: approved
   $max_reply     = intval(processText($_POST["max"]));
   $secured       = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
   $protocol      = strleft(strtolower($_SERVER["SERVER_PROTOCOL"]), "/") . $secured;
   $ec_path       = $protocol . '://' . $_SERVER['HTTP_HOST'] . processText($_POST["path"]);

   if ( empty($parent_id) ){
      $parent_id = null;
   }

   $ip  = $_SERVER["REMOTE_ADDR"];
   $ret = addComment($abs_comment_file,$caller,$title,$dom_id,$comment_id,$date_value,$author_value,$subject_value,$email,$site,$msg_value,$ip,$moderate,$parent_id,$max_reply);

   $msg_value     = str_replace(array("\r","\n"),"<br />", $msg_value);
   echo json_encode(
     array(
         "id"      =>    $comment_id,
         "comment" =>    '<li class="ec-comment" id="' . $comment_id . '">'.
                         '   <div class="avatar"></div>'.
                         '   <span class="user-name author">' . $author_value . '</span> <br/>' .
                         '   <span class="comment-html">'.
                         (empty($subject_value) ? '' : '      <strong>' . $subject_value . '</strong><br /><br />') .
                         $msg_value .
                         '   </span><br/>'.
                         '   <span class="comment-time">' . ago(time() - $date_value*1) . '</span><br/>'.
                         (($ret)?'   <button name="reply" id="reply_' . $comment_id . '">Reply</button>':"") .
                         '</li>'

     )
   );

   // send email to moderator
//   if ( $moderate == "1" ){
      $body = 'A new comment is waiting for your approval:<br /><br />'.
              'Author:' . $author_value . '(IP: ' . $ip .')<br/>'.
              'Email:' . $email . '<br/>'.
              'URL:' . $site . '<br/>'.
              'Subject:' . $subject_value . '<br/>'.
              'Whois:<a href="http://whois.arin.net/rest/ip/' . $ip .'" target="_blank">http://whois.arin.net/rest/ip/' . $ip .'</a><br/>'.
              'Comment:<br/>'.
              '<blockquote>' . $msg_value . '</blockquote><br/>'.
              'To moderate this message, click <a href="'. $ec_path .'ec-dashboard.html">'. $ec_path .'ec-dashboard.html</a><br/>'.
              '<br/>'.
              'Thanks for choosing EastComment<br/><br/>'.
              '<a href="http://www.jswidget.com/lab/easy-comment.html" target="_blank">http://www.jswidget.com/lab/easy-comment.html</a>';
      sendEmail($moderator_email,$body);
//   }
}

function sendEmail($email,$msg){
   $headers  = 'MIME-Version: 1.0' . "\r\n";
   $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

   // Additional headers
   $headers .= 'From: Easy Comment<support@jswidget.com>' . "\r\n";

   @mail($email, "Please moderate:",$msg,$headers);
}
function addComment($CommentFile,$caller,$title,$dom_id,$comment_id,$date_value,$author_value,$subject_value,$email,$site,$msg_value,$ip,$moderate,$parent_id,$max_reply){
	$xml = new DomDocument('1.0','utf-8');

	if ( file_exists($CommentFile) ){
	   $xml->load($CommentFile,LIBXML_NOBLANKS);
      $xpath = new DOMXPath($xml);
		$result = $xpath->query("//comments/dom-element[@domid='$dom_id']");
      if ( $result->length === 0 ){
         $comments = $xml->firstChild;
         $root = $xml->createElement("dom-element");
         add_attribute($xml,$root,"domid",$dom_id);
         $root = $comments->appendChild($root);
      }else{
         $root = $result->item(0);
      }
	}else{
		$comments = $xml->appendChild($xml->createElement("comments"));
      add_attribute($xml,$comments ,"url",$caller);
      add_attribute($xml,$comments ,"title",$title);

      $root = $xml->createElement("dom-element");
      add_attribute($xml,$root,"domid",$dom_id);
      $root = $comments->appendChild($root);
	}

	if ( !is_null($parent_id) ){
      $result = $xpath->query("//*[@id='$parent_id']");
      $parent = $result->item(0);
      $found_reply_element = false;
      foreach($parent->childNodes as $child){
         $tag = $child->tagName;
         if ($tag == "reply"){
            $found_reply_element = true;
            $root = $child;
            break;
         }
      }
      if ( !$found_reply_element ){
         $root = $parent->appendChild($xml->createElement("reply"));
      }
   }

   $comment = $xml->createElement("comment");
   $root->appendChild($comment);
   $level = getCommentLevel($comment);

   add_attribute($xml,$comment,"id",$comment_id);
   add_attribute($xml,$comment,"level",$level);
   add_attribute($xml,$comment,"moderate",$moderate);
   add_attribute($xml,$comment,"email",$email);
   add_attribute($xml,$comment,"site",$site);
   add_attribute($xml,$comment,"timestamp",$date_value);
   add_attribute($xml,$comment,"time",date('Y-m-d H:i:s',$date_value));
   add_attribute($xml,$comment,"author",$author_value);
   add_attribute($xml,$comment,"ip",$ip);

	// add subject child node
	$subject = $xml->createElement("subject");
	$comment->appendChild($subject);
	$value = $xml->createTextNode($subject_value);
	$subject->appendChild($value);

   // add message child node
	$msg = $xml->createElement("message");
	$comment->appendChild($msg);
	$value = $xml->createTextNode($msg_value);
	$msg->appendChild($value);

	$xml->save($CommentFile);


   if ( $level >= $max_reply ){
      return false;
   }
   return true;
}
function getCommentLevel($Comment){
   $level = 0;
   $parent = $Comment->parentNode;
   if ( $parent ){
      while ($parent){
         if ( $parent->tagName === "comment" ){
            $level ++;
         }
         if ( $parent->tagName === "comments" ){
            break;
         }
         $parent = $parent->parentNode;
      }
   }
   return $level;
}

function add_attribute($xml,&$node,$attr_name,$attr_value){
	$attr = $xml->createAttribute($attr_name);
	$node->appendChild($attr);

	$value = $xml->createTextNode($attr_value);
	$attr->appendChild($value);
}
function read_comment(){
   $total_comment = 0;
   $total_reply   = 0;
   $cur_level     = 0;

   $caller        = strtolower($_POST["url"]); //$_SERVER['HTTP_REFERER'];
   $filename      = md5($caller);
   $abs_comment_file = '/home/s080de29/public_html/log/' . $filename . '.xml';

   $dom_id        = processText($_POST["domid"]);
   $max_reply     = intval(processText($_POST["max"]));
   $comments_per_page  = intval(processText($_POST["pagecount"]));
   $pageno        = intval(processText($_POST["pageno"]));

   if ( $comments_per_page == 0 ){
      $comments_per_page = 100000;
   }

   $start = $pageno * $comments_per_page;
   $end   = $start + $comments_per_page;

   //$abs_comment_file = "G:/MyProjects/Lab/easy-comment/comment.xml";
   $xml = new DomDocument('1.0','utf-8');
   if ( file_exists($abs_comment_file) ){
      $comments = array();

      $xml->load($abs_comment_file,LIBXML_NOBLANKS);
      $xpath = new DOMXPath($xml);
      $qry = "//comments/dom-element[@domid='$dom_id']/comment[(@moderate='0') or (@moderate='4') or ((@moderate='1') and (@ip='" . $_SERVER["REMOTE_ADDR"] ."'))]";

      $children = $xpath->query($qry);
      $total = $children->length;

      $end = min($total,$end);
      for ( $i = $end - 1; $i >= $start; $i --){
         $last_child = $children->item($total - $i - 1);
         $cmt = getComment($last_child,$total_comment,$total_reply,false,$cur_level,$max_reply);
         $comments[] = $cmt;
      }

      echo json_encode(array("total_comment"=>$total,"total_reply"=>$total_reply,"comments"=>$comments));
   }else{
      echo json_encode(array("total_comment"=>0,"total_reply"=>0));
   }
}
function getComment($comment,&$total_comment,&$total_reply,$isReply,&$cur_level,$max_reply){
   $comment->normalize();
   $time    = $comment->getAttribute("timestamp");
   $author  = $comment->getAttribute("author");
   $ip      = $comment->getAttribute("ip");
   $id      = $comment->getAttribute("id");

   $subject = trim($comment->childNodes->item(0)->nodeValue);
   $msg     = trim($comment->childNodes->item(1)->nodeValue);
   $msg     = str_replace(array("\r","\n"),"<br />", $msg);
   $msg     = str_replace(array("[[","]]"),array("<",">"), $msg);

   $time    = ago(time() - $time*1);

   $html = '<li class="ec-comment" id="' . $id . '">' .
           '   <div class="avatar"></div>'.
           '   <span class="user-name author">' . $author . '</span> <br />' .
           '   <span class="comment-html">'.
           (empty($subject) ? "" : '      <strong>' . $subject . '</strong><br /><br />') .
           $msg .
           '   </span><br>'.
           '   <span class="comment-time">' . $time . '</span><br />';
   if ( $cur_level < $max_reply ){
      $html .= '   <button name="reply" id="reply_' . $id . '">Reply</button>';
   }
   if ( $isReply ){
      $total_reply ++;
   }else{
      $total_comment ++;
   }
   if ( $comment->childNodes->length == 3 ){
      $cur_level ++;
      $root = $comment->childNodes->item(2);
      $last_child = $root->lastChild;
      if ( $last_child ){

         //$html .= '<ul class="ec-comment-list">';
         $temp_html = null;
         while ( $last_child ){
            $moderate = $last_child->getAttribute("moderate");
            $ip = $last_child->getAttribute("ip");
            if ( $moderate === "0" || $moderate === "4" ||
                 ( $moderate === "1" && $ip === $_SERVER["REMOTE_ADDR"]) ){
               if ( is_null($temp_html) ){
                  $temp_html = '<ul class="ec-comment-list">';
               }
               $temp_html .= getComment($last_child,$total_comment,$total_reply,true,&$cur_level,$max_reply);
            }
            $last_child = $last_child -> previousSibling;
         }

         if ( !is_null($temp_html) ){
            $temp_html .= '</ul>';
            $html .= $temp_html;
         }
      }
   }
   $html .= '</li>';
   return $html;
}

function allowToShow($comment){
   $moderate = $comment->getAttribute("moderate");
   $cmt_ip   = $comment->getAttribute("ip");
   $cur_ip   = $_SERVER["REMOTE_ADDR"];
   if ( $moderate === "0" /*no moderate*/||
        $moderate === "4" /* approved */ ||
        ($moderate === "1" /* waiting for moderate */ && $cmt_ip === $cur_ip) ){
      return true;
   }
   return false;
}

function processText($s){
   $s = str_replace(array('&'    , '<'   , '>'   , "\\'"    , '\\"'),
                    array('&amp;', '&lt;', '&gt;', "&#39;", '&quot;'),
                    $s);
   $s = allowTag($s);
   $s = allowTag1($s);
   return $s;
}

function getStr($number,$unit){
	return ($number == 0) ? '' : ( $number . ( ($number == 1) ? (' ' . $unit) : (' ' . $unit . 's') ) );
}

function ago($timeSpan,$precise = false){
	if ( $timeSpan < 60 ){
		$second = $timeSpan;
		return ($second == 0) ? "Just now" : getStr($second,'second') . ' ago';
	}else{
		$second = $timeSpan % 60;
		$minute = floor(($timeSpan - $second) / 60);
		if ( $minute < 60 ){
			return getStr($minute,'minute') . ' ' . getStr($second,'second') . ' ago';
		}else{
			$min  = $minute % 60;
			$hour = floor(($minute - $min) / 60);
			if ( $hour < 24 ){

				return ($precise) ? (getStr($hour,'hour') . ' ' . getStr($min,'minute') . ' ' . getStr($second,'second') . ' ago')
				                  : (getStr($hour,'hour') . ' ' . getStr($min,'minute') . ' ago');
			}else{
				$hr = $hour % 24;
				$days = floor(($hour - $hr) / 24);
				return ($precise) ? (getStr($days,'day') . ' ' . getStr($hr,'hour') . ' ' . getStr($min,'minute') . ' ' . getStr($second,'second') . ' ago')
				                  : (($days == 1) ? 'yesterday' : $days . ' days' . ' ago');
			}
		}
	}
}
function allowTag($s){
   $sPattern = array(
      '|\[b\](.*?)\[\/b\]|'           => '<strong>$1</strong>',
      '|\[u\](.*?)\[\/u\]|'           => '<u>$1</u>',
      '|\[i\](.*?)\[\/i\]|'           => '<i>$1</i>',
      '|\[strike\](.*?)\[\/strike\]|' => '<strike>$1</strike>',
      '|\[quote\](.*?)\[\/quote\]|'   => '<blockquote>$1</blockquote>'
   );

   $s = preg_replace(array_keys($sPattern),array_values($sPattern),$s);
   return $s;
}

function allowTag1($s){
   $fn_callback_a = "processA";
   $fn_callback_img = "processImg";
   $s = preg_replace_callback('|\[link\](.*?)\[\/link\]|',$fn_callback_a,$s);
   $s = preg_replace_callback('|\[img\](.*?)\[\/img\]|',$fn_callback_img,$s);
   return $s;
}

function processA($match){
   if ( validateURL($match[1]) ){
      return '<a href="' . $match[1] . '" target="_blank">' . $match[1] . '</a>';
   }
   return $match[1];
}
function processImg($match){
   if ( validateURL($match[1]) ){
      return '<img src="' . $match[1] . '"></img>';
   }
   return $match[1];
}
function validateURL($url){
   $urlregex = "^(https?|ftp)\:\/\/([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?[a-z0-9+\$_-]+(\.[a-z0-9+\$_-]+)*(\:[0-9]{2,5})?(\/([a-z0-9+\$_-]\.?)+)*\/?(\?[a-z+&\$_.-][a-z0-9;:@/&%=+\$_.-]*)?(#[a-z_.-][a-z0-9+\$_.-]*)?\$";
   if (eregi($urlregex, $url)) {
      return true;
   }
   return false;
}
?>
