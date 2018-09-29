<?php
   $postdata = file_get_contents("php://input");
   $filename = "alerts.json";
   if($postdata){
      $fp = fopen($filename, 'w');
      fwrite($fp, $postdata);
      fclose($fp);
   }else{
      $fp = fopen($filename, 'r');
      $result = fread($fp, filesize($filename));
      fclose($fp);
      echo $result;
   }
?>
