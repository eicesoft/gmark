<template>
  <div class="edit-md">
    <div class="edit-title">
      <input
        placeholder="请输入标题"
        class="txt-title"
        type="text"
        v-model="title"
      />
    </div>
    <div style="margin-top: 10px">
      <mavon-editor
        :style="{ height: editHeight + 'px' }"
        :toolbars="toolbars"
        :subfield="false"
        placeholder="前输入文档内容"
        v-model="content"
      />
    </div>

    <div class="toolbar">
      <el-button type="primary" size="mini" @click="save">保存</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/util/axios";

export default {
  data() {
    return {
      id: "",
      title: "",
      content: "",
      editHeight: 0,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: false, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: false // 预览
      }
    };
  },
  async created() {
    console.log(document.documentElement.clientHeight);
    this.editHeight = document.documentElement.clientHeight - 150;
    window.onresize = () => {
      this.editHeight = document.documentElement.clientHeight - 150;
    };
    if (this.$route.query.id == 0) {
      this.title = "";
      this.id = 0;
      this.content = "";
    } else {
      let resp = await get("page/view", { page_id: this.$route.query.id });
      console.log(resp.data);
      this.title = resp.data.title;
      this.id = resp.data.id;
      this.content = resp.data.content;
    }
  },
  methods: {
    async save() {
      if (this.title.trim().length == 0) {
        this.$message("必须输入标题");
        return;
      }

      if (this.$route.query.id == 0) {
        let resp = await post("/page/create", {
          book_id: parseInt(this.$route.query.book_id),
          title: this.title.trim(),
          content: this.content
        });
        console.log(resp);

        this.$notify({
          title: "成功",
          message: "新建数据成功",
          type: "success",
          duration: 1000
        });
      } else {
        let resp = await post("/page/save", {
          page_id: this.id,
          title: this.title,
          content: this.content
        });
        console.log(resp);

        this.$notify({
          title: "成功",
          message: "保存数据成功",
          type: "success",
          duration: 1000
        });
      }
      this.$router.back(-1);

      // this.$router.push({
      //   path: "/book_view",
      //   query: { id: this.$route.query.book_id }
      // });
    },
    back() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-md {
  padding: 15px;
  .edit-title {
    display: flex;
    width: 100%;
    .txt-title {
      border: 1px solid #eeeeee;
      box-shadow: rgb(0 0 0 / 10%) 0px 2px 12px 0px;
      border-radius: 4px;
      width: 100%;
      height: 30px;
      outline: none;
      padding: 0 10px;
    }
  }
  .toolbar {
    margin: 10px 0 0 0;
    text-align: right;
  }
}
</style>
