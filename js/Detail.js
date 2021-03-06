import Component from "./Component.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import AJAX from "./AJAX.js";
import Utils from "./Utils.js";
import Zoom from "./Zoom.js";
import StepNumber from "./StepNumber.js";
import CityMenu from "./CityMenu.js";

export default class Detail extends Component {

    static detailAPI = "http://localhost:8080/getDetail";
    static addCartAPI = "http://localhost:8080/addCart";

    headerElem
    data
    prev
    zoom
    numCon
    imgList
    main
    stepNumber
    currentSelect
    cityMenu
    id

    constructor() {
        super();
        this.setCss()
        this.elem = document.createElement("body")
        this.id = Utils.getUrlParam("id") // get id from url
        this.generateHTML()
    }

    async generateHTML() {
        this.data = await new AJAX(Detail.detailAPI + "?id=" + this.id) // get data from server by id
        this.createHeader(this.elem) // create header content
        this.createMain(this.elem) // create main content
        this.createFooter(this.elem) // create footer content
        this.imgList = [this.data.img1, this.data.img2, this.data.img3, this.data.img4, this.data.img5]
        this.createZoom(this.imgList, ".main-content-left")
        this.createCityMenu(this.main.querySelector(".city-menu-container"))

        this.linkSKUWithImgCon()
        this.numCon = this.elem.querySelector(".step-num") // get step-num container
        this.changeCurrentSelect(this.data.sku[0].id)
        this.createStepNumber(this.main.querySelector(".step-num"))
        this.listenAddCartBtn()
    }

    listenAddCartBtn(){
        this.elem.querySelector(".add-cart").addEventListener("click", (e) => this.addCartHandler(e))
    }

    async addCartHandler(e){
        let user = JSON.parse(localStorage.getItem("user"))
        if (!user) location.href = "./login.html"
        let body = {
            uid: user.id,
            pid:this.currentSelect,
            num:this.stepNumber.num
        }
        await new AJAX(Detail.addCartAPI, {
            method: "POST",
            body: JSON.stringify(body)
        })
        await this.headerElem.updateCartNum()
    }

    changeCurrentSelect(id) {
        this.currentSelect = id
        this.elem.querySelector("#price").innerText = this.data.sku.find(item => item.id === id).price
    }

    linkSKUWithImgCon() {
        let sku = this.elem.querySelectorAll(".choose-item")
        sku.forEach(item => item.addEventListener("click", e => this.skuClickHandler(e)))
    }

    skuClickHandler(e) {
        if (e.target.nodeName !== "IMG") return
        if (this.prev) this.prev.parentNode.classList.remove("selected")
        this.prev = e.target
        e.target.parentNode.classList.add("selected")
        this.changeCurrentSelect(Number(e.target.parentNode.getAttribute("sku")))
        this.zoom.changeImg("./" + this.currentSelect + ".webp")
    }

    createCityMenu(parent) {
        this.cityMenu = new CityMenu()
        this.cityMenu.appendTo(parent)
    }

    createStepNumber(parent){
        this.stepNumber = new StepNumber()
        this.stepNumber.appendTo(parent)
    }

    createZoom(arr, parent) {
        this.zoom = new Zoom(arr)
        this.zoom.appendTo(parent)
    }

    createHeader(parent) {
        this.headerElem = new Header()
        this.headerElem.appendTo(parent)
    }

    createFooter(parent) {
        new Footer().appendTo(parent)
    }

    createMain(parent) {
        this.main = document.createElement("main")
        this.main.innerHTML += `
        <main>
            <div class="container">
                <div class="main-content">
                
                    <div class="main-content-left"></div>
        
                    <div class="main-content-right">
                        <div class="right-top">
                            <h2>${this.data.title}</h2>
                            <p>${this.data.desc}</p>
                            <div class="rating-con">
                                <p>${this.data.rating}%</p>
                                <p>?????????</p>
                            </div>
                        </div>
                        <div class="right-main">
                            <div>
                                <span>??????</span>
                                <strong>??<span id="price">${this.data.sku[0].price}</span></strong>
                            </div>
                            <div>
                                <span>??????</span>
                                <a href="#" class="tag">????????????</a>
                                <a href="#" class="discount">????????????</a>
                            </div>
                            <div>
                                <span>??????</span>
                                <span>???99?????????, ??????8???</span>
                            </div>
                            <div>
                                <span>??????</span>
                                <a href="#" class="service"><span>????????????</span><span>30???????????????</span><span>??????????????????????????????</span></a>
                            </div>
                            <div>
                                <span>??????</span>
                                <div class="city-menu-container"></div>
                            </div>
                        </div>
        
                        <div class="choose-con">
                            <span>??????</span>
                            <div class="choose-content">
                                
                            ${this.data.sku.reduce((v, t) => {
                return v + `
                                <div class="choose-item" sku="${t.id}">
                                    <img src="./productImg/${t.id}.webp" alt="">
                                    <span>${t.subtitle}</span>
                                </div>
        `
            }, "")}
                                
                            </div>
                        </div>
        
                        <div class="step-num">
                            <span>??????</span>             
                        </div>
        
                        <div class="buy">
                            <a href="#" class="buy-btn">????????????</a>
                            <a href="#" class="add-cart"><i class="fa fa-shopping-cart"></i> ???????????????</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
`
        parent.appendChild(this.main)
    }

    setCss() {
        if (Detail.cssBool) return;
        Detail.cssBool = true;
        document.head.innerHTML += `
            <link rel="stylesheet" href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css">
            <link rel="stylesheet" href="./css/normalize.css">
            <link rel="stylesheet" href="./css/detail.css">
            <link rel="stylesheet" href="./css/global.css">            
        `
    }

}