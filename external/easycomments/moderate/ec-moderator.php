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

$action  = $_POST["action"];
switch($action){
case "getpages":getPages();break;
case "ok":moderate($action);break;
case "trash":moderate($action);break;
case "spam":moderate($action);break;
case "comment":get_comments();break;
}

function getPages(){
   $path = '/home/s080de29/public_html/log/';
   $dircontent = scandir($path);

   $arr = array();
   foreach($dircontent as $filename) {
      if ($filename != '.' && $filename != '..') {
         $ext = strtolower(substr($filename, strrpos($filename, '.') + 1));
         if ( $ext == "xml" ){
            $xml = new DomDocument('1.0','utf-8');
            if ( $xml->load($path . $filename,LIBXML_NOBLANKS) ){
               $root = $xml->firstChild;
               if ( $root->tagName === "comments" ){
                  $url   = $root->getAttribute("url");
                  $title = $root->getAttribute("title");
                  $xpath = new DOMXPath($xml);
                  $result = $xpath->query("//comments/dom-element");
                  $elem = array();
                  for ($i = 0; $i < $result->length; $i ++ ){
                     $domid = $result->item($i)->getAttribute("domid");
                     $elem[] = $domid;
                  }

                  $arr[] = array(
                     'url' => $url,
                     'file' => str_replace('.xml','',$path . $filename),
                     'title' => $title,
                     'section' => $elem
                  );
               }
             }
         }
      }
   }
   echo json_encode($arr);
}

function moderate($action){
   $page       = $_POST["page"] . '.xml';
   $comment_id = $_POST["comment"];
   if ( is_file($page) ){
      $xml = new DomDocument('1.0','utf-8');
      if ( $xml->load($page,LIBXML_NOBLANKS) ){
         $xpath = new DOMXPath($xml);
         $result = $xpath->query("//comments/dom-element/descendant::comment[@id='$comment_id']");
         if ( $result->length === 1 ){
            $node = $result->item(0);
            switch($action){
            case "ok": $node->setAttribute("moderate","4");break;
            case "trash": $node->setAttribute("moderate","2");break;
            case "spam":
               $node->setAttribute("moderate","3");
               addToSpamer($node->getAttribute("ip"));
               break;
            }
            $xml->save($page);
         }
      }
   }
   echo json_encode(array('status'=>0));
}

function addToSpamer($ip){
   $spammer_lib = realpath('.') . '/ec-spammer.xml';
   $xml = new DomDocument('1.0','utf-8');
   $root = null;
   if ( file_exists($spammer_lib) ){
      if ( $xml->load($spammer_lib,LIBXML_NOBLANKS) ){
         $root = $xml->firstChild;
      }
   }else{
      $root = $xml->appendChild($xml->createElement("spammers"));
   }

   if ( !is_null($root) ){
      $xpath = new DOMXPath($xml);
		$result = $xpath->query("//spammers/spammer[@ip='$ip']");
      if ( $result->length === 0 ){
         $spam = $root->appendChild($xml->createElement("spammer"));
         add_attribute($xml,$spam,'ip',$ip);
         $date_value = time();
         add_attribute($xml,$spam,"timestamp",$date_value);
         add_attribute($xml,$spam,"time",date('Y-m-d H:i:s',$date_value));
         add_attribute($xml,$spam,"count",1);
      }else{
         $node = $result->item(0);
         $count = intval($node->getAttribute("count"));
         $node->setAttribute("count",$count+1);
      }
      $xml->save($spammer_lib);
   }
}
function isSpammer($ip){
   $spammer = realpath('.') . '/ec-spammer.xml';
   $xml = new DomDocument('1.0','utf-8');
   $root = null;
   if ( file_exists($spammer) ){
      if ( $xml->load($spammer,LIBXML_NOBLANKS) ){
         $xpath = new DOMXPath($xml);
         $result = $xpath->query("//spammers/spammer[@ip='$ip']");
         if ( $result->length === 1 ){
            return true;
         }
      }
   }
   return false;
}

function add_attribute($xml,&$node,$attr_name,$attr_value){
	$attr = $xml->createAttribute($attr_name);
	$node->appendChild($attr);

	$value = $xml->createTextNode($attr_value);
	$attr->appendChild($value);
}

function get_comments(){
  $page       = $_POST["page"] . '.xml';
  $domid      = $_POST["domid"];
  $moderate   = $_POST["type"];
  $arr = array();
   if ( is_file($page) ){
      $xml = new DomDocument('1.0','utf-8');
      if ( $xml->load($page,LIBXML_NOBLANKS) ){
         $xpath = new DOMXPath($xml);
         $qry = "//comments/dom-element[@domid='$domid']/descendant::comment[@moderate='$moderate']";
         if ( $moderate == "4" ){
            $qry = "//comments/dom-element[@domid='$domid']/descendant::comment[(@moderate='4') or (@moderate='0')]";
         }
         $result = $xpath->query($qry);
         if ( $result->length > 0 ){
            for ( $i = 0; $i < $result->length; $i++){
               $comment = $result->item($i);
               $ip = $comment->getAttribute("ip");
               $author = $comment->getAttribute("author");
               $site = $comment->getAttribute("site");
               $email = $comment->getAttribute("email");
               $time = $comment->getAttribute("time");
               $id = $comment->getAttribute("id");
               $subject = $comment->childNodes->item(0)->nodeValue;
               $msg = $comment->childNodes->item(1)->nodeValue;
               $arr[] = array(
                  'ip'=>$ip,
                  'id'=>$id,
                  'author'=>$author,
                  'site'=>$site,
                  'email'=>$email,
                  'time'=>$time,
                  'subject'=>$subject,
                  'msg'=>$msg
               );
            }
         }
      }
   }
   echo json_encode($arr);
}
?>
