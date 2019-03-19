<?php
   error_reporting(E_ALL);
   $json = file_get_contents("php://input");
   $data = json_decode($json, true);
   $account = $data["user"];   
   $filename = "saves/alerts/".$account."_alerts.json";
   if($data["data"]){
      $fp = fopen($filename, 'w');
      fwrite($fp, $data["data"]);
      fclose($fp);
   }else{
      $fp = fopen($filename, 'r');
      $result = fread($fp, filesize($filename));
      fclose($fp);
      echo $result;
   }
?>
