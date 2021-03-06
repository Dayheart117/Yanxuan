import Header from "./Header.js";
import Footer from "./Footer.js";
import Component from "./Component.js";
import AJAX from "./AJAX.js";

export default class Login extends Component {

    static loginAPI="http://localhost:8080/login"
    static registerAPI="http://localhost:8080/register"
    headerElem
    elem
    switchLogin
    loginContent
    loginBtn
    registerBtn


    constructor() {
        super();
        if (localStorage.getItem("user")) window.location.href = "./index.html"
        this.elem = document.createElement("body")
        this.setCss()
        this.createHeader(this.elem)
        this.generateHTML()
        this.createFooter(this.elem)
        this.addSwitch()
        this.addBtnListener()
    }

    addBtnListener() {
        this.loginBtn = this.elem.querySelector("#login")
        this.registerBtn = this.elem.querySelector("#register")
        this.loginBtn.addEventListener("click", e => this.btnClickHandler(e))
        this.registerBtn.addEventListener("click", e => this.btnClickHandler(e))
    }

    async btnClickHandler(e) {
        e.preventDefault()
        let reqURL = e.target.id === "login" ? Login.loginAPI : Login.registerAPI
        let reqBody = {
            username: this.elem.querySelector("#username").value,
            password: this.elem.querySelector("#password").value
        }
        let data = await new AJAX(reqURL, {method:"POST",body:JSON.stringify(reqBody)})
        if (!data.ok) {
            alert(data.msg)
            return
        } else if (data.ok) {
            let user = data.data
            localStorage.setItem("user", JSON.stringify(user))
            window.location.href = "./index.html"
        }
    }

    addSwitch() {
        this.switchLogin = this.elem.querySelector(".switch-login")
        this.loginContent = this.elem.querySelectorAll(".login-content > div")
        this.switchLogin.addEventListener("click", e => this.clickHandler(e))
    }

    clickHandler(e) {
        this.loginContent.forEach(item => item.classList.toggle("hidden"))
    }

    createHeader(parent) {
        this.headerElem = new Header()
        this.headerElem.appendTo(parent)
    }

    createFooter(parent) {
        new Footer().appendTo(parent)
    }

    generateHTML() {
        let main = document.createElement("main")
        main.innerHTML += `
            <div class="banner">
                <img src="./img/loginbg.jpg" alt="">
            </div>
            <div class="login">
                <div class="container">
                    <div class="login-box">
                        <div class="switch-login">
                            <img src="./img/02ec8f409e64be946b92cf3b65a363c0.png" alt="">
                            <img src="./img/eb0a8c711a86705c798dd6364fbbf8c6.png" alt="">
                        </div>
                        <div class="login-content">
                            <div class="qr">
                                <p>APP?????? ????????????</p>
                                <img src="./img/???PNG ?????????190x190 ?????????.png" alt="">
                                <p>??????<span>????????????APP</span>????????????</p>
                            </div>
                            <div class="form hidden">
                                <form action="">
                                    <div>
                                        <label for="username"><i class="fa fa-user"></i></label>
                                        <input type="text" id="username" placeholder="??????????????????">
                                    </div>
                                    <div>
                                        <label for="password"><i class="fa fa-key"></i></label>
                                        <input type="password" id="password" placeholder="???????????????">
                                    </div>
                                    <div>
                                        <button id="login">???&nbsp;&nbsp;&nbsp;???</button>
                                        <button id="register">???&nbsp;&nbsp;&nbsp;???</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="login-bottom">
                            <a id="register" href="javascript:;">?????????????</a>
                            <!--<a href="javascript:;">???&nbsp;&nbsp;&nbsp;???</a>-->
                        </div>
                    </div>
                </div>
            </div>
        `
        this.elem.append(main)
    }

    setCss() {
        document.head.innerHTML += `
            <link rel="stylesheet" href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css">
            <link rel="stylesheet" href="./css/normalize.css">
            <link rel="stylesheet" href="./css/login.css">
            <link rel="stylesheet" href="./css/global.css">
        `
    }
}