<template>
  <vue-drawer-layout
      ref="drawer"
      :content-drawable ="true"
      :drawer-width="width"
      :drawable-distance="width"
      @mask-click="maskClick"
      @slide-end="handleSlideEnd">
      <div class="drawer-content" slot="drawer">
        <div class="menu-top">
          <div class="login">
            <img src="@/assets/cc-head-o.png">
            <span>请登录</span>
          </div>
          <div class="top-menu">
            <div class="collect">
              <img src="@/assets/star.png">
              <span>收藏</span>
            </div>
            <div class="message">
              <img src="@/assets/cc-bell-o.png">
              <span>消息</span>
            </div>
            <div class="set">
              <img src="@/assets/set.png">
              <span>设置</span>
            </div>
          </div>
        </div>
        <div class="menu-middle">
          <scroll>
            <ul>
              <li v-for="(theme,index) in themes.others" :key="index">
                <van-cell :title=theme.name is-link />
              </li>
            </ul>
          </scroll>
        </div>
        <div class="menu-bottom">
          <div class="off-line">
            <img src="@/assets/offline_download.png">
            <span>离线</span>
          </div>
          <div class="night">
            <img src="@/assets/night.png">
            <span>夜间</span>
          </div>
        </div>
      </div>
      <div class="main" slot="content">
        <div class="header" :style="{background:'rgba(0, 119, 255, '+opacity+')'}">
          <img class="icon" src="@/assets/menu.png" @click="showmMenu()">
          <div class="title">
            {{new Date().format('yyyy-MM-dd').replace(/-/g,'') === beforeDate ? '今日热闻' : beforeDate}}
          </div>
        </div>
        <scroll
        :probeType="3" :listenScroll="true" @scroll="listenScroll" @click="click" :pullup="true" @scrollEnd="scrollEnd"> 
          <ul>
            <li>
              <van-swipe :autoplay="3000">
                <van-swipe-item v-for="(story, index) in topicList" :key="index">
                  <img v-lazy="parseImageUrl(story.image)" />
                </van-swipe-item>
              </van-swipe>
            </li>
            <li class="list" v-for="news in newsList" :key="news.id">
                <div class="news-content">
                  <h5>{{news.title}}</h5>
                  <img :src="parseImageUrl(news.images[0])" alt="" v-if="news.images && news.images[0]">
                </div>
            </li>
          </ul>
        </scroll>
      </div>
    </vue-drawer-layout>
</template>

<script>
import Scroll from './scroll/Scroll'
const drawerWidth = Math.floor(document.body.clientWidth * 0.6)
Date.prototype.format = function (formatStr) {  
    var date = this;  
    /*  
    函数：填充0字符  
    参数：value-需要填充的字符串, length-总长度  
    返回：填充后的字符串  
    */ 
    var zeroize = function (value, length) {  
        if (!length) {  
            length = 2;  
        }  
        value = new String(value);  
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {  
            zeros += '0';  
        }  
            return zeros + value;  
    };  
    return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function($0) {  
        switch ($0) {  
            case 'd': return date.getDate();  
            case 'dd': return zeroize(date.getDate());  
            case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];  
            case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];  
            case 'M': return date.getMonth() + 1;  
            case 'MM': return zeroize(date.getMonth() + 1);  
            case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];  
            case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];  
            case 'yy': return new String(date.getFullYear()).substr(2);  
            case 'yyyy': return date.getFullYear();  
            case 'h': return date.getHours() % 12 || 12;  
            case 'hh': return zeroize(date.getHours() % 12 || 12);  
            case 'H': return date.getHours();  
            case 'HH': return zeroize(date.getHours());  
            case 'm': return date.getMinutes();  
            case 'mm': return zeroize(date.getMinutes());  
            case 's': return date.getSeconds();  
            case 'ss': return zeroize(date.getSeconds());  
            case 'l': return date.getMilliseconds();  
            case 'll': return zeroize(date.getMilliseconds());  
            case 'tt': return date.getHours() < 12 ? 'am' : 'pm';  
            case 'TT': return date.getHours() < 12 ? 'AM' : 'PM';  
        }  
    });  
}


export default {
  data(){
    return{
      newsList:{},
      topicList:{},
      themes:{},
      opacity:0,
      show: true,
      width: drawerWidth,
      beforeDate: ''
    }
  },
  created(){
      this.$http({
        method:'get',
        url:'/apis/api/4/news/latest',
      })
        .then(response=>{
          this.newsList = response.data.stories;
          this.topicList = response.data.top_stories;
          this.beforeDate = response.data.date;
          // this.getNewsBeforeDate();
        }),
      this.$http({
        method:'get',
        url:'/apis/api/4/themes',
      })
        .then(response=>{
          this.themes = response.data;
        })
    },
    methods:{
      getNewsBeforeDate() {
        this.$http({
        method:'get',
        url:'/apis/api/4/news/before/'+this.beforeDate,
      })
        .then(response=>{
          this.newsList = this.newsList.concat(response.data.stories);
        })
      },
      parseImageUrl(url) {
        if (url !== undefined) {
          return url.replace(/http\w{0,1}:\/\/p/g, 'https://images.weserv.nl/?url=p');
        }
      },
      listenScroll(pos){
        if(pos.y > 0) {
          this.opacity = 0;
        } else if (pos.y > -180) {
        this.opacity = pos.y / -180
        } else {
          this.opacity = 1
        }
      },
      click(){
        console.log('点击列表了')
      },
      scrollEnd(){
        console.log('要到这里来了')
        this.getNewsBeforeDate()
      },
      maskClick(){
        this.show = false
        this.$refs.drawer.toggle(false) //复位
      },
      showmMenu(){
        console.log('按钮被点击了')
        console.log(this.show)
        this.show = !this.show
        this.$refs.drawer.toggle(this.show)
      },
      handleSlideEnd(visible){
        console.log(visible)
        console.log('来到了滑动这里')
        //滑动结束
        this.show = !this.show
      }
    },
    components:{
      Scroll
    },
    mounted() {
      // 注：window.onresize只能在项目内触发1次
      window.onresize = function windowResize () {
        console.log('你觉得会不会开到这里')
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.width = window.innerWidth * 0.6;
        console.log(this.width)
      }
    }
}
</script>

<style lang="scss">
.drawer-layout{
    .drawer-wrap{
      .drawer-content{
        height: 100%;
        width: 100%;
        .menu-top{
           background: #333;
          z-index: 10;
          text-align: start;
          width: 100%;
          height: 140px;
          top: 0;
          position: absolute;
          .login{
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 70px;
            margin-top: 50px;
            height: 30px;;
            img{
              width: 24px;
            }
            span{
              color: #dedede;
              font-size: 13px;
            }
          }
          .top-menu{
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .collect, .message, .set{
              width: 30px;
              text-align: center;
              img{
                display: block;
                width: 16px;
                margin-left: 7px;
              }
              span{
                margin-top: 5px;
                display: block;
                color: #dedede;
                font-size: 11px;
              }
            }
          }
        }
        .menu-middle{
          top: 140px;
          bottom: 60px;
          position: absolute;
          width: 100%;
          z-index: 5;
          background: #333;
          .scroll{
            width: 100%;
            top: 0;
            bottom: 0;
            position: absolute;
            z-index: 5;
            ul li{
              .van-cell{
                background: #333;
                .van-cell__title{
                  text-align: start;
                  color: #dedede;
                }
              }
            }
          }
        }
        .menu-bottom{
          width: 100%;
          height: 60px;
          bottom: 0;
          z-index: 10;
          display: flex;
          justify-content: space-around;
          align-items: center;
           background: #333;
          position: absolute;
          .off-line, .night{
            img{
              width: 20px;
              height: 20px;
            }
            span{
              color: white;
              font-size: 12px;
            }
          }
        }
      }
    }
    .content-wrap{
      .drawer-mask{
        background: rgba($color: #fff, $alpha: 0)
      }
      .main{
        width: 100%;
        height: 100%;
        .header{
          height: 64px;
          width: 100%;
          z-index: 9;
          position: relative;
          .icon{
            width: 24px;
            height: 24px;
            left: 15px;
            bottom: 10px;
            position: absolute;
            float: left;
          }
          .title{
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            top: 20px;
            left: 50px;
            right: 50px;
            line-height: 44px;
            color: white;
            position: absolute;
            z-index: 999;
          }
        }
        .scroll{
          z-index: 5;
          width: 100%;
          top: 0;
          bottom: 0;
          position: absolute;
          ul{
            flex: 1;
            .van-swipe{
              width: 100%;
              height: 200px;
              .van-swipe__indicators{
                bottom: 10px;
                .van-swipe__indicator--active{
                  background-color: white;
                }
              }
              img{
                width: 100%;
                height: 200px;
              }
            }
            .list{
              padding: 10px 15px;
              border-bottom: 1px solid #e4e4e4;
              .news-content{
                display: flex;
                align-items: center;
                h5{
                  color: #333;
                  text-align: left;
                  font-size: 15px;
                  font-weight: bold;
                  flex: 1;
                  margin-right: 10px;
                }
                img{
                  height: 70px;
                  width: 90px;
                  flex: 0 0 90px;
                }
              }
            }
          }
        }
      }
    }
  } 

</style>
