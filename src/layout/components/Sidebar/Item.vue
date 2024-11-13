<script>
/**
 * 定义一个名为MenuItem的函数式组件，用于渲染带有图标的菜单标题
 * 该组件接收两个props：icon和title
 * icon是一个字符串，用于指定图标的类名
 * title是一个字符串，用于指定菜单标题
 */
export default {
  name: 'MenuItem',
  functional: true, // 函数式组件
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 渲染的函数
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    // 如果icon存在
    if (icon) {
      // 如果icon包含字符串'el-icon'
      if (icon.includes('el-icon')) {
        // 渲染一个i标签，其类名是icon和'sub-el-icon'
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 否则，渲染一个svg-icon组件，其icon-class属性是icon
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    // 如果title存在
    if (title) {
      // 渲染一个span标签，其slot属性是title，内容是title
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes // 返回渲染的节点
  }
}
</script>

<style scoped>
/**
 * 定义一个名为sub-el-icon的类，用于设置图标的颜色和大小
 * 该类的颜色是当前文本颜色（currentColor）
 * 该类的宽度和高度都是1em
 */
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
