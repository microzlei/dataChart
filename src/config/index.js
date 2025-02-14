export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '招商交科云眼-后台系统',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  // baseUrl: {
  //   dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
  //   pro: 'https://produce.com'
  // },
  baseUrl: {
    // dev: 'http://localhost:34216/api/method',
    dev: 'http://api.cloudeyes.cn/api/method',
    pro: 'http://api.cloudeyes.cn/api/method'
  },
  appKey: 1592916922,
  appSecret: '491757313797a966d295e9b4ad99b39f',
  // baseUrl: {
  //   dev: 'http://localhost:34216/api/method',
  //   pro: 'http://localhost:34216/api/method'
  // },
  fileUpdateUrl: 'http://api.cloudeyes.cn/api/general_file_upload',
  errorImgUrl: 'http://static.cloudeyes.cn/failed.jpg',
  defaultCenter: [106.58169398217274, 40.512893993724287],
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'user_page',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
