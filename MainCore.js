
const mongoose = require( 'mongoose' );
const http = require( 'http' );
const url = require( 'url' );
// 提取數據 轉換成數據對象
const queryString = require( 'querystring' ); 

const app = http.createServer();

mongoose.connect( 'mongodb://localhost/MainCore' , { useUnifiedTopology: true , useNewUrlParser: true } )
        .then( function() { console.log( '連接成功' ) } )
        .catch( error => console.log( error , '連接失敗' ) );

const getSchema = new mongoose.Schema( { 

        Name: {

            type: String,

            required: true,

            minlength: [ 0 , '請輸入大於0的字符串' ],

            maxlength: [ 15 , '請輸入小於15的字符串' ],

            trim: true

        },

        Age: {

            type: Number,

            required: true,

            min: [ 15 , '年齡不能小於15歲' ],

            max: [ 125 , '年齡沒有超過125歲的喔' ]


        },

        Password: String,
        
        Email: String,

        Hobby: [ String ]

 } )

const user = mongoose.model( 'User' , getSchema ); // 數據庫自動轉化 users

app.on( 'request' , async ( request , respond ) => { 

    const method = request.method;

    // 獲取請求網路域名 url.parse() 轉換   url.parse() 裡面有pathname對象  該對象可以獲取網路域名
    const { pathname , query } = url.parse( request.url , true );
    // console.log( pathname );
    // console.log( query );

    

    if ( method == 'GET') {


        if ( pathname == '/list' ) {

            let users = await user.find();

            console.log( users );

            let list = `
            <!doctype html>
            <html lang="en">
              <head>           
                <!-- Required meta tags -->
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <!-- Bootstrap CSS -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
                
                <title>list</title>

              </head>
              <body>
            
                <div class="container" style="margin-top: 100px;" >
            
                    <h6>
                        <a href="/add" class="btn btn-primary">增加用戶</a>
                    </h6>
                    
                    <table class="table table-bordered border border-1 border-info " style=" text-align: center !important;" >
            
                        <tr>
                            <td>Name</td>
                            <td>Age</td>
                            <td>Password</td>
                            <td>Email</td>
                            <td>Hobby</td>
                            <td>操作</td>
                        </tr>           
                    `;

            // forEach 可以把數據庫數組轉換為對象
            users.forEach( item => {

                // 之後模板化
                list = list + `
                <tr>
                    <td>${ item.Name }</td>
                    <td>${ item.Age }</td>
                    <td>${ item.Password }</td>
                    <td>${ item.Email }</td>
                    <td>
                            `

                item.Hobby.forEach( item => {

                    list = list + `<span>${ item }</span>`

                })

                    
                list = list + `
                </td>
                    <td>
                        <a href="#" class="btn btn-danger"> 刪除 </a>
                        <a href="/modify?id=${ item._id }" class="btn btn-success"> 編輯 </a>
                    </td>
                </tr>    
                
                            `
            })


            list = list + `
            
                    </table>

                </div>  

              </body>          
            </html>  
                    `;

            respond.end( list );

        }else if ( pathname == '/add') {

            let add = `<!doctype html>
            <html lang="en">
              <head>
                <!-- Required meta tags -->
                <meta charset="utf-8">  
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <!-- Bootstrap CSS -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
            
                <title>add</title>
            
                <style>
                    .extra {
                        position: absolute;
                        right: 25%;
                       
                    }        
                </style>
            
              </head>
              <body>
            
                <div class="container" style="margin-top: 100px;" >
            
                    <h1>新增用戶</h1>
            
                    <form action="/add" method="POST">
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 名字 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" name="Name" class="form-control" placeholder="請輸入用戶名"> <br>
            
                        </div>
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 年齡 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" name="Age" class="form-control" placeholder="請輸入年齡"> <br>
            
                        </div>
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 密碼 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" name="Password" class="form-control" placeholder="請輸入密碼"> <br>
            
                        </div>
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 信箱 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" name="Email" class="form-control" placeholder="請輸入信箱"> <br>
            
            
                        </div>
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;">興趣</label>
            
                                <div>
            
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "打代碼" > 打代碼
            
                                    </label>
            
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "聽音樂" > 聽音樂
            
                                    </label>
            
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "想事情或哲學" > 想事情或哲學
            
                                    </label>
            
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "耍廢" > 耍廢
            
                                    </label>
            
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "玩社交" > 玩社交
            
                                    </label>      
            
                                </div>              
            
                        </div>      
            
                        <div class="form-group extra" >
            
                            <button type="submit" class="btn btn-primary">添加數據</button>
            
                        </div>
            
                    </form>   
            
                </div>      
              </body>
            </html>
                    `;

            respond.end( add );
        }else if ( pathname == '/modify' ) {

            // findOne 可以 把數組find 換成對象刑事
            let use = await user.findOne( { _id: query.id } );
            console.log( use );

            let hobbies = [  '打代碼' ,  '聽音樂' , '想事情或哲學' ,  '耍廢' ,  '玩社交' ];

            let modify = `
            <!doctype html>
            <html lang="en">
              <head>
                <!-- Required meta tags -->
                <meta charset="utf-8">  
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <!-- Bootstrap CSS -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
            
                <title>add</title>
            
                <style>
                    .extra {
                        position: absolute;
                        right: 25%;
                       
                    }        
                </style>
            
              </head>
              <body>
            
                <div class="container" style="margin-top: 100px;" >
            
                    <h1>修改用戶</h1>
            
                    <form action="/add" method="POST">
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 名字 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" value="${ use.Name }" name="Name" class="form-control" placeholder="請輸入用戶名"> <br>
            
                        </div>
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 年齡 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" value="${ use.Age }" name="Age" class="form-control" placeholder="請輸入年齡"> <br>
            
                        </div>
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 密碼 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" value="${ use.Password }" name="Password" class="form-control" placeholder="請輸入密碼"> <br>
            
                        </div>
            
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;"> 信箱 </label>
                            <!-- placeholder 可以掩蓋輸入 -->
                            <input type="text" value="${ use.Email }" name="Email" class="form-control" placeholder="請輸入信箱"> <br>
            
            
                        </div>
                        <div class="form-group">
            
                            <label for="" style="font-size: 24px;">興趣</label>
                            <div>
                        `
            

            hobbies.forEach( item => {

                let boolean_use = use.Hobby.includes( item );

                if ( boolean_use ) {

                    modify = modify + `    
                                                   
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "${ item }" checked = checked > ${ item }
            
                                    </label>
                                                                       
    
                    `

                } else {

                    modify = modify + `    
                   
                                    <label class="checkbox-inline">
            
                                        <input type="checkbox"  name="Hobby" value= "${ item }"  > ${ item }
            
                                    </label>
                                                                         
                    `
                }
            } )
            
            modify = modify + `

                        </div> 
                    </div>      
                    <div class="form-group extra" >
            
                        <button type="submit" class="btn btn-primary">修改數據</button>

                    </div>

                </form>   

              </div>      
             </body>
            </html>
                    `
            respond.end( modify );
        }


    } else if ( method == 'POST') {


        if( pathname == '/add' ) {

            console.log( '提交成功' );

            let get_Data = '';

            // 獲取數據
            request.on( 'data' , param => {

                get_Data = get_Data + param;

            } ); 

            // 數據展示
            request.on( 'end' ,  async () => {

                // parse為轉換
                const change_Number = queryString.parse( get_Data );

                console.log( change_Number );

                // 將用戶提交的訊息添加到數據庫中
                await user.create( change_Number );

                // 另外一個方式
                // 301代表重定向 接 location
                // location 跳轉地址
                respond.writeHead( 301 , {

                    Location: '/list'

                } );
                // 有重定向方式必須接 respond.end()
                // 客戶端請求沒有結束
                // 沒有respond.end() 表示還沒有結束
                respond.end()
                
            })

        } 


    }

 } )

app.listen( 5000 );
console.log( '瀏覽器已經連接成功' );