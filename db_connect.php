<?php
$servername = "localhost";
$username = "u537910683_movie"; 
$password = "rfifhG0_0"; // تم وضع كلمة المرور داخل علامات التنصيص
$dbname = "u537910683_elmnoor"; 

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("فشل الاتصال: " . $conn->connect_error);
}
?>