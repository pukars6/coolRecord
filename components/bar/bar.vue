<template>
	<view>
		<view class="header" :style="{'height':titleBarHeight,'padding-top':statusBarHeight}">
			<text class="iconfont leftArrow header-back weight"   :style="{'border':nav.color}" v-if="nav.isdisPlayNavTitle" @tap="back"></text>
			<view class="goal-container animated"  v-if="nav.isShowGoal" @tap="jumpToGoal()">
				<image class="iconimg icon-goal" :style="{'width':iconimg,'height':iconimg}" src="../../static/icon/goal.png"></image>
				<!-- 目标 -->
			</view>
			<view class="list-container animated"  v-if="nav.isShowSetting"  @tap="jumpToList()">
				<image class="iconimg icon-list" :style="{'width':iconimg,'height':iconimg}" src="../../static/icon/list.png"></image>
				<!-- 列表 -->
			</view>
			<view class="setting-container animated"  v-if="nav.isShowSetting"  @tap="jumpToSetting()">
				<image class="iconimg icon-setting" :style="{'width':iconimg,'height':iconimg}" src="../../static/icon/setting.png"></image>
				<!-- 设置 -->
			</view>
			
			<view class="header-title weight" @tap="back">{{nav.navTitle}}</view>
		</view>
		<view  :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
	</view>
</template>
<script>
	export default {
		props:{
			"nav":{
				isShowGoal:{default:false},
				isShowSetting:{default:false},
			}
			},
		data() {
			return {
				statusBarHeight: 0, 
				titleBarHeight: 0, 
				iconimg:'44rpx',
			}
		},
		created() {
			var  that = this;
			 	uni.getSystemInfo({
			 		success: function(res) {
			 			if (res.model.indexOf('iPhone') !== -1) {
							that.titleBarHeight = 44 + 'px';
			 			} else {
			 				that.titleBarHeight = 48  + 'px';
						}
							that.statusBarHeight = res.statusBarHeight  + 'px'
					},
						
			 	})
		 },
		methods: {
			 // 回到上一页
			 back: function(){
				 uni.navigateBack({
				 	delta:1
				 })
			 },
			 jumpToGoal(){
				wx.vibrateShort()
			 	uni.navigateTo({
			 	    url: '../goal/goal'
			 	});
			 },
			 jumpToSetting(){
				wx.vibrateShort()
			 	uni.navigateTo({
			 	    url: '../setting/setting'
			 	});
			 },
			 jumpToList(){
			 	wx.vibrateShort()
			 	uni.navigateTo({
			 	    url: '../list/list'
			 	});
			 }
		}
	}
</script>

<style lang="scss">
	
	.header {
        font-family:"Microsoft YaHei";
		display: flex;
        margin:0 20rpx;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 100;
		/* left:5%; */
	}
	
	.header .header-title {
        font-weight: bold;
        color: #fff;
		/* position: absolute;
		left: 10%; */
		font-size: 38rpx;
		/* transform: translateX(-50%); */
	}
	.header-back{
		margin-right:6rpx ;
		// position: absolute;
		/* left:15upx; */
		color: #fff;
		font-size:32upx;
		padding: 12upx;
		border-radius: 50%;
	}
	.goal-container{
		color: #fff;
		box-sizing: border-box;
		padding: 12rpx 22rpx;
		border-radius: 18px;
		display: flex;
		justify-content: space-around;
		margin-right: 10rpx;
		
		background: rgba(67,49,193,0.8);
		.iconimg{
			width: 48rpx !important;
			height: 48rpx !important;
		}

	}
	.setting-container{
		color: #fff;
		box-sizing: border-box;
		padding: 12rpx 22rpx;
		border-radius: 18px;
		display: flex;
		justify-content: space-around;
		margin-right: 10rpx;
		background: rgba(67,49,193,0.8);
		.iconimg{
			width: 48rpx !important;
			height: 48rpx !important;
		}
	}
	.list-container{
		color: #fff;
		box-sizing: border-box;
		padding: 12rpx 22rpx;
		border-radius: 18px;
		display: flex;
		justify-content: space-around;
		margin-right: 10rpx;
		background: rgba(67,49,193,0.8);
		.iconimg{
			width: 45rpx !important;
			height: 45rpx !important;
		}
	}
</style>
