<?php
   $postdata = file_get_contents("php://input");
   $filename = "results.json";
   if($postdata){
      $fp = fopen($filename, 'w');
      fwrite($fp, $postdata);
      fclose($fp);
   }else{
      $fp = fopen($filename, 'r');
      if (filesize($filename) == 0){
         $result = "[]";
      }else{
         $result = fread($fp, filesize($filename));
         fclose($fp);
      }
      echo $result;
   }
?>
