<template>
  <el-container>
    <el-aside width="200px" class="menus">
      <div style="text-align: right; margin-right: 10px; line-height: 28px">
        <el-link type="info" @click="back" :underline="false">返回</el-link>
        &nbsp;
        <el-link type="primary" @click="newPage" :underline="false">
          新建
        </el-link>
      </div>
      <div
        @click="view(page)"
        :class="{
          active: now_page != null && now_page.id == page.id,
          menu: true
        }"
        :key="index"
        v-for="(page, index) in pages"
      >
        <div class="menu-title">{{ page.title }}</div>
        <div class="menu-icon" @click.stop="deletePage(page)">
          <i class="el-icon-delete"></i>
        </div>
      </div>
    </el-aside>
    <el-main class="page">
      <template v-if="!refresh">
        <div class="toc-icon" @mouseover="tocActive = true">
          <i class="el-icon-s-fold"></i>
        </div>
        <div v-show="tocActive" class="toc" id="toc"></div>
        <div v-if="now_page != null" @click="tocActive = false">
          <div class="page-title">
            {{ now_page.title }}
            <i
              title="编辑"
              @click="editPage(now_page)"
              class="el-icon-edit-outline"
            ></i>
            <i title="下载" @click="download()" class="el-icon-download"></i>
          </div>
          <div class="line-numbers" ref="page">
            <vue-markdown
              class="view"
              :html="true"
              :source="content"
              v-on:rendered="allRight"
              v-on:toc-rendered="tocAllRight"
              :toc-first-level="1"
              :toc-last-level="4"
              :linkify="true"
              :tocAnchorLink="true"
              :toc="true"
              toc-id="toc"
            ></vue-markdown>
          </div>
        </div>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import Prism from "prismjs";
import { get, post } from "@/util/axios";
import VueMarkdown from "vue-markdown";
Prism.manual = true;

export default {
  components: { VueMarkdown },
  data() {
    return {
      refresh: false,
      pages: [],
      now_page: null,
      content: "",
      tocActive: false
    };
  },
  async created() {
    this.load();
  },
  async activated() {
    this.now_page = null;
    this.content = "";
    this.load();
  },
  methods: {
    download() {
      this.getPdfFromHtml(this.$refs.page, this.now_page.title);
    },
    async load() {
      console.log(this.$route.query);
      if (this.$route.query.id != undefined) {
        let resp = await get("page/list", { book_id: this.$route.query.id });
        this.pages = resp.data;

        if (this.pages.length > 0) {
          this.view(this.pages[0]);
        }
      } else {
        let resp = await get("page/search", {
          keyword: this.$route.query.keyword
        });
        if (resp.data !== null) {
          this.pages = resp.data;

          if (this.pages.length > 0) {
            this.view(this.pages[0]);
          }
        }
      }
    },
    async view(page) {
      this.refresh = true;
      let resp = await get("page/view", { page_id: page.id });
      // console.log(resp);
      this.now_page = resp.data;
      this.content = resp.data.content;
      this.$nextTick(() => {
        Prism.highlightAll();
      });

      this.refresh = false;
    },
    async editPage(page) {
      this.$router.push({
        path: "/page_edit",
        query: { id: page.id, book_id: page.book_id }
      });
    },
    async deletePage(page) {
      let resp = await post("/page/delete", { page_id: page.id });
      console.log(resp);

      this.$confirm(`此操作将永久删除${page.title}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.load();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    back() {
      this.$event.$emit("back");
      this.$router.push({ path: "/" });
    },
    newPage() {
      this.$router.push({
        path: "/page_edit",
        query: { id: 0, book_id: this.$route.query.id }
      });
    },
    allRight: function () {
      console.log("markdown is parsed !");
    },
    tocAllRight: function () {
      // console.log("toc is parsed :");
    }
  }
};
</script>

<style lang="scss">
.table {
  border-collapse: collapse;
  td,
  th {
    border: 1px solid #ececec;
    padding: 4px 8px;
  }
}
.token {
  font-size: 12px !important;
}
pre[class*="language-"].line-numbers {
  padding-left: 2.8em;
}
pre[class*="language-"] {
  padding: 1em;
  border-radius: 5px;
  line-height: 1.1;
}
code[class*="language-"] {
  font-size: 12px !important;
}
.el-container {
  height: 100%;
}
.table-of-contents {
  list-style: none;
  padding: 15px 30px;
  margin: auto;
  a {
    font-size: 13px !important;
  }
}
.el-main {
  padding: 0;
}
.page {
  img {
    max-width: 728px;
  }
}
</style>

<style lang="scss" scoped>
.icon {
  font-size: 32px;
  cursor: pointer;
}
.toc-icon {
  position: fixed;
  top: 60px;
  right: 40px;
  font-size: 24px;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #f0f0f0;
  z-index: 100;
}
.toc {
  position: fixed;
  top: 60px;
  right: 40px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  width: 280px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  user-select: none;
  z-index: 100;
}
.menus {
  text-align: left;
  border-right: 1px solid #f0f0f0;
  padding: 10px 0px 10px 0px;
  height: 100%;
  .active {
    background-color: #f0f0f0;
    border-right: 4px solid #cacaca !important;
  }
  .menu {
    border-right: 4px solid #ffffff;

    font-size: 13px;
    line-height: 24px;
    padding: 2px 6px;
    cursor: pointer;
    display: flex;

    .menu-title {
      width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      user-select: none;
      justify-content: space-between;
    }
    .menu-icon {
      font-size: 16px;
      &:hover {
        color: #1f4474;
      }
    }
  }
}
.line-numbers {
  height: 100%;
}
.page {
  text-align: left;
  //   padding: 40px;
  .page-title {
    padding: 5px 10px;
    font-size: 20px;
    font-weight: 800;
    background-color: #fff;
    cursor: pointer;
    position: fixed;
    top: 38px;
    padding: 20px 30px;
    width: 80%;
  }
  .view {
    margin: 80px;
    // height: 600px;
  }
}
</style>
