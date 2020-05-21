var Fly=require('../common/wx.umd.min.js') //wx.js为您下载的源码文件
var fly=new Fly;
const whiteUrl='/login/auth'

fly.config.baseURL = "http://www.codeskystar.cn/weixin"
// 配置响应拦截器
fly.interceptors.response.use(
	(response) => {
			// 如果请求报错
			if (response.data.code == 301) {
				console.log("token无效，重新登录")
				login() //token过期，重新登录
				return response.data

			}
			else if(response.data.code != 200){
				uni.showModal({
					title:'提示',
					content:response.data,
					showCancel:false
				})
			}
			else{
				//只将请求结果的data字段返回
				console.log("请求正常："+response.engine.responseURL)
				return response.data
			}
		},
		(err) => {
			//发生网络错误后会走到这里
			uni.showModal({
				title:'咦',
				content:"网络好像出现了点问题o(╥﹏╥)o",
				showCancel:false
			})
			return Promise.resolve("网络好像出现了点问题o(╥﹏╥)o")
		}
)
// 配置请求拦截器
fly.interceptors.request.use((request) => {
	if(request.url != whiteUrl)
		request.headers["Authorization"] = 'Bearer '+uni.getStorageSync('token');
		
	request.headers["content-type"]="application/json"
	return request;
})


async function wxLogin() {
	return await new Promise((resolve, reject) => {
		uni.login({
			provider:'weixin',
			success:function(loginRes){
				let code = loginRes.code;
				if(code){
					resolve(code)
				}
			}
		})
	})
}

export const login = async () => {
	console.log('开始登录...')
	let code = await wxLogin();
	let res = await fly.get('/login/auth',{code: code});
	uni.setStorageSync('token',res.data.token)
	console.log("token:")
	console.log(res.data.token)
}

export const checkToken = async () => {

		console.log('查询token有效接口...')
		return fly.get('/chart/token')
}

export const fetchGoalDetail = async () => {

		console.log('请求查询目标接口...')
		return fly.get('/goal/detail')
}
export const PostGoal = async (data) => {

		console.log('请求设置目标接口...')
		return fly.post('/goal/set',data)
}

export const fetchHomeChart = async () => {

		console.log('请求首页饼图接口...')
		return fly.get('/chart/home')
}

export const fetchOrderListByDate = async (date) => {

		console.log('请求账单列表接口...')
		return fly.get('/order/list',{date:date})
}

export const postOrder = async (data) => {

		console.log('请求账单列表接口...')
		return fly.post('/order/set',data)
}

export const fetchCategoryData = async () => {

		console.log('请求账单列表接口...')
		return fly.get('/category/detail')
}
