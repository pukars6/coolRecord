<template>
	<view class="recordlist-container animated fadeInUp delay-016s" @tap="hidetip()">
		<view class="header">
			<view class="title">
				<image class="icon" src="../../static/icon/index-list.png" mode=""></image>
				<view class="text">
					今日账单
				</view>
				
			</view>
			<view class="more"  @tap="jumpToList()" >
				<!-- <image class="icon" src="../../static/icon/eye.png" mode=""></image> -->
				<view class="text">
					查看全部
				</view>
				
			</view>
			
		</view>
		
		<view v-if="orderList.length==0" class="nodata-container">
			<view class="img-container">
				<image class="nodata-img" src="../../static/bg/nodata.png" mode=""></image>
			</view>
			
			<view class="text">
				今天没有账单记录哦~
			</view>
		</view>
		<load-refresh
			v-else
		  ref="loadRefresh"
		  :isRefresh="false"
		  :refreshTime="800"
		  :heightReduce="10"
		  :pageNo="currPage"
		  :totalPageNo="totalPage" 
		  @loadMore="loadMore" 
		  @refresh="refresh">
		  <view slot="content-list">
			<view  class="recordlist-content">
					<view v-if="showtip" class="tip">
						左滑可以编辑和删除哦~
					</view>
					<view :key="item.orderId" class="list-item" v-for="item in orderList" @touchstart="touchItemStart" @touchmove="touchItemMove" @touchend="touchItemEnd(item.orderId)">
						<view :class="{menuactive:selectOrderId===item.orderId}" class="menu-container" >
							<view class="edit" @tap="jumpToOrder(item.orderId)">
								编辑
							</view>
							<view class="delete" @tap="deleteOrder(item.orderId)">
								删除
							</view>
						</view>
						<view class="left-content">
							<image class="category-img" :src="item.categoryImgUrl" mode=""></image>
						</view>
						<view class="right-content">
							<view class="info">
								<view class="text">
									<view class="category-text">
										{{item.categoryName}}
									</view>
									<view class="other-text">
										{{item.remark}}
									</view>
								</view>
							</view>
							<view class="num">
								<view v-if="item.type==0" class="rmb" style="color:red">
									-{{item.money}}
								</view>
								<view v-else class="rmb">
									+{{item.money}}
								</view>
								<view class="time">
									{{item.date}}
								</view>
							</view>
						</view>
					</view>
			</view>
		</view>
		</load-refresh>
	</view>
</template>

<script>
	import {formatDate } from '../../utils/date.js'
	var startX = 0; 
	var endX =0;
	export default {

		data() {
			return {
				selectOrderId:'',
				orderList:[],
				device:'',
				showtip:true,
				currPage:1,
				totalPage:1
			};
		},
		mounted() {

		},
		created() {
		},
		methods:{
			hidetip(){
				this.showtip = false
			},
			jumpToList(){
				uni.navigateTo({
				    url: '../list/list'
				});
			},
			showMenu(id){
				
			},
			touchItemStart(e){
				console.log(e)
				startX=e.touches[0].pageX;
			},
			touchItemMove(e){
				console.log(e)
				endX=e.touches[0].pageX;
			},
			touchItemEnd(id){
				let distance = endX-startX
				// if(this.device == ''){}
				if(id && distance<=-50)
					this.selectOrderId = id
				else this.selectOrderId = ''
				
			},
			loadMore() {
				console.log('loadMore')
				// let data = {"orderId":"1594614713297175617","categoryId":6,"categoryName":"学习","categoryImgUrl":"https://oukarsblog.oss-cn-hangzhou.aliyuncs.com/weixin_miniapp_img/icon/06xuexi.png","type":0,"date":"2020-07-13 00:00:00","remark":"练习册1111","money":4.00}
				// this.orderList.push(data)
				// 请求新数据完成后调用 组件内loadOver()方法
				// 注意更新当前页码 currPage
				this.currPage++;
				this.fetchTodayOrderList(this.currPage)
				
				this.$refs.loadRefresh.loadOver()
			},
			refresh(){
				this.fetchTodayOrderList(1,'',true)
			},
			getLength(str){
				var len = 0;
					for (var i = 0; i < str.length; i++) {
						var c = str.charCodeAt(i);
						//单字节加1
						if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
							len++;
						}
						else {
							len += 2;
						}
					}
				return len;

			},
			formateRemark(remark){
				let length = this.getLength(remark)
				if(length > 16){
					// remark= remark.slice(0,16)
					remark = remark.substring(0,10)
					remark = remark + '...'
				}
				return remark
			},
			async fetchTodayOrderList(currPage = 1,categoryId = '',refresh = false){
				let date = new Date()
				let formatdate = formatDate(date)
				const res = await this.$api.fetchOrderList(formatdate,currPage,categoryId,0)
				
				if(res.data && res.data.data.length>=0){
					this.totalPage = res.data.totalPage
					this.orderList = res.data.data
					console.log('今日账单列表',this.orderList)
					this.orderList.forEach(e=>{
						e.date = e.date.replace(/-/g, '/')
						e.date = formatDate(new Date(e.date))
						e.remark =this.formateRemark(e.remark)
					})
					// this.orderList = this.orderList.reverse()
					// if(refresh == true){
					// 	uni.showToast({
					// 	    title: '刷新成功',
					// 	    duration: 2000
					// 	});
					// }
				}
				 
			},
			async deleteOrderRequest(id){
				const result = await this.$api.deleteOrder(id)
				if(result.data.message=='删除成功'){
					uni.showModal({
						title:'欧耶',
						content:"删除成功！",
						showCancel:false,
					})
					this.$emit('updateInfo')
					this.fetchTodayOrderList()
				} else {
					uni.showModal({
						title:'咦',
						content:"好像失败了o(╥﹏╥)o",
						showCancel:false,
					})
				}
			},
			deleteOrder(id){
				wx.vibrateShort()
				let _self =this
				if(!id)
					return
				uni.showModal({
				    title: '删除账单',
				    content: '确定要删除该账单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户确定删除');
							_self.deleteOrderRequest(id)
				        } else if (res.cancel) {
				            console.log('用户取消删除');
				        }
				    }
				});
			},
			jumpToOrder(id){
				uni.navigateTo({
				    url: '../order/order?orderid='+id
				});
				this.selectOrderId =''
			}
		}
	}
</script>

<style lang="scss">
.recordlist-container{
	box-sizing: border-box;
	margin-top: 30rpx;
	padding-top: 10rpx;
	
	height: auto;
	
	.nodata-container{
		margin: 60rpx 0;
		width: 100%;
		text-align: center;
		.img-container{
			width: 120rpx;
			height: 95rpx;
			margin:10rpx auto;
			.nodata-img{
				opacity: 0.8;
				width: 120rpx;
				height: 95rpx;
			}
		}
		
		.text{
			opacity: 0.8;
			color: #A7A7F9;
		}
	}
	.header{
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		height: auto;
		.title{
			display: flex;
			align-items:center;
			
			.icon{
				width: 44rpx;
				height: 44rpx;
				margin-right: 6rpx;
			}
			.text{
				
				color:#A7A7F9;
				font-weight: bold;
				font-size: 36rpx;
			}
		}
		.more{
			box-sizing: border-box;
			padding: 10rpx 24rpx;
			background: #4331C1;
			border-radius: 18rpx;
			font-size: 32rpx;
			color: #A7A7F9;
			display: flex;
			align-items: center;
			.icon{
				font-weight: bold;
				width: 38rpx;
				height: 38rpx;
				margin-right: 6rpx;
			}
		}
	}
	.recordlist-content{
		box-sizing: border-box;
		padding: 0rpx 0rpx 20rpx;
		border-radius:20rpx ;
		// background: #fff;
		width: 100%;
		height: auto;
		position: relative;
		overflow: hidden;
		.tip{
			margin: 0rpx auto 20rpx;
			text-align: center;
			color:#A0A0F0;
		
			font-size: 32rpx;
		}
		.menu-container{
			top:0;
			right: 0;
			width: 320rpx;
			height: 140rpx;
			// background: pink;
			border-top-right-radius: 15rpx;
			border-bottom-right-radius: 15rpx;
			right: -100%;
			opacity: 0;
			transition: all .2s;
			position: absolute;
			vertical-align: middle;
			display: flex;
			justify-content: flex-start;
			.edit{
				width: 160rpx;
				vertical-align: middle;
				text-align: center;
				background: rgb(255,227,108);;
				color: rgb(67,73,106);
				line-height: 140rpx;
				font-weight: bold;
				font-size: 36rpx;
			}
			.delete{
				width: 160rpx;
				vertical-align: middle;
				text-align: center;
				line-height: 140rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #fff;
			}
		}
		.menuactive{
			opacity: 1;
			right: 0;
			background: red !important;
		}
		.list-item{
			margin-bottom: 24rpx;
			background: #fff;
			box-shadow: 0rpx 10rpx 25rpx -8rpx rgba(41,41,41,0.5);
			border-radius: 15rpx;
			box-sizing: border-box;
			padding: 20rpx 40rpx;
			// color: ;
			
			// background-image:linear-gradient(75deg,#AF4DFF,#6327F6);
			width: 100%;
			height: 140rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: nowrap;
			position: relative;
			.left-content{
				box-sizing: border-box;
				padding: 20rpx 0;
				width: 16%;
				.category-img{
					width: 72rpx;
					height: 72rpx;
				}
			}
			.right-content{
				box-sizing: border-box;

				box-sizing: border-box;
				padding-left: 5rpx;
				border-left: 2rpx solid rgb(230,210,240);
				width: 84%;
				display: flex;
				justify-content: space-between;
				.info{
					text-align: left;
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.text{
						
						margin-left:20rpx ;
						.category-text{
							box-sizing: border-box;
							padding-bottom:10rpx;
							font-size: 34rpx;
							// font-weight: bold;
							color:#1D1C5C;
							font-weight: bold;
						}
						.other-text{
							width: 300rpx;
							height: 40rpx;
							box-sizing: border-box;
							font-size: 26rpx;
							overflow: hidden;
							color: #C0C0C0	;
						}
					}
				}
				.num{
					margin-top: 10rpx;
					vertical-align: middle;
					text-align: right;
					.rmb{
						font-size: 42rpx;
						font-weight: bold;
						color: #13BB16;
					}
					.time{
						font-size: 24rpx;
						color: #A9A9A9	;
					}
					
				}
			}
		}
	}
}
</style>
