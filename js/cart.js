/**
 * Created by cyb on 2019/3/23.
 */
var vm = new Vue({
   el:"#app",
    data:{
        totalMoney:0,
        totalPrice:0,
        productList:[],
        checkAllFlag:false,
        delFlag:false,
        curProduct:''
    },
    filters:{
        formatMoney:function(value){
            return "￥"+value.toFixed(2);
        }
    },
    mounted:function(){
        this.$nextTick(function () {
            // 代码保证 this.$el 在 document 中(即确保vue实例已经插入到dom节点里面)
            this.cartView();
        })

    },
    methods:{
        cartView:function(){
            // var _this = this;
            // this.$http.get("data/cartData.json",{"id":123}).then(function (res) {
            //     _this.productList = res.data.result.list;
            //     _this.totalMoney = res.data.result.totalMoney;
            // });

            this.$http.get("data/cartData.json",{"id":123}).then(res=>{
                //箭头函数的this已经指向外层
                this.productList = res.data.result.list;
                this.totalMoney = res.data.result.totalMoney;
            });
        },
        changeMoney:function(product,way){
            if(way>0){
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity =1;
                }
            }
            this.calcTotalPrice();
        },
        selectedProduct:function(item){
            //typeof 判断一个对象的变量是否存在
            if(typeof item.checked == 'undefined'){
                Vue.set(item,"checked",true);
                // this.$set(item,"checked",true);
            }else{
                item.checked = !item.checked;
            }
            this.calcTotalPrice();
        },
        checkAll:function(flag){
            this.checkAllFlag = flag;
            var _this = this;

            this.productList.forEach(function (item,index) {
                if(typeof item.checked == 'undefined'){
                    _this.$set(item,"checked",_this.checkAllFlag);
                }else{
                    item.checked = _this.checkAllFlag;
                }
            });
            this.calcTotalPrice();
        },

        calcTotalPrice:function(){
            var _this = this;
            _this.totalPrice = 0;
            this.productList.forEach(function (item,index) {
                if(item.checked == true){
                    _this.totalPrice += item.productPrice*item.productQuantity;
                }
            });
        },
        delConfirm:function (item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct:function(){
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index,1);
            this.delFlag = false;
        }
    }

});
Vue.filter("money",function(value,type){
    return "￥"+value.toFixed(2) + type;
})