let express = require('express');

let app = express();

app.get('/', function (req, res) {
   res.cookie("userId",'e18a0f771ac4485fa9107d8382326e57');
   res.cookie("userName",'黄少明');
   res.cookie('CRE', 'http://192.168.8.196:8090/cre');
   res.cookie('RESOURCEMANAGER', 'http://192.168.8.196:8090/resourcemanager');
   res.cookie('PORTAL', 'http://192.168.8.196:8090/portal');
   res.cookie('PEOPLEDAILYAPI', 'http://192.168.8.101:8080/DYPDNewsCommandWeb');
   res.send('设置cookie成功');

   /*res.cookie('CRE', 'http://192.168.8.241/cre');
   res.cookie('RESOURCEMANAGER', 'http://192.168.8.241/resourcemanager');
   res.cookie('PORTAL', 'http://192.168.8.241/portal');
   res.cookie('PEOPLEDAILYAPI', 'http://192.168.8.101:8080/DYPDNewsCommandWeb');
   res.send('设置cookie成功');*/
});

app.listen(3001, function () {
    console.log('app started listening 3001');
});
