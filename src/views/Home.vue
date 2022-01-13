<template>
  <div class="home">
    <div class="action">
      <el-tooltip
        class="item"
        effect="dark"
        content="新建文集"
        placement="bottom-start"
      >
        <el-button
          @click="createBook"
          type="primary"
          icon="el-icon-notebook-1"
          circle
        ></el-button>
      </el-tooltip>
    </div>
    <div class="books">
      <div
        @click="view(book)"
        :title="book.title"
        class="book"
        :key="index"
        v-for="(book, index) in books"
      >
        <div class="book-title">{{ book.title }}</div>
        <div class="book-date">{{ book.updated_at | dateFmt }}</div>
        <div class="book-tool">
          <el-tooltip effect="dark" content="修改标题" placement="bottom">
            <i @click.stop="editBook(book)" class="el-icon-edit"></i>
          </el-tooltip>

          <el-tooltip effect="dark" content="删除Book" placement="bottom">
            <i @click.stop="deleteBook(book)" class="el-icon-delete"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/util/axios";
import moment from "moment";
export default {
  name: "Home",
  components: {},
  data() {
    return { books: [] };
  },
  filters: {
    dateFmt(el) {
      return moment(el).format("YYYY-MM-DD HH:mm");
    }
  },
  async created() {
    this.load();
  },
  methods: {
    async load() {
      let resp = await get("book/list", { page: 1, page_size: 100 });
      this.books = resp.data;
    },
    view(book) {
      console.log(book);
      this.$router.push({ path: "/book_view", query: { id: book.id } });
    },
    createBook() {
      this.$prompt("请输入书本名称", "提示", {
        inputValue: "",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async ({ value }) => {
        let resp = await post("/book/create", { title: value });
        console.log(resp);
        this.load();
        this.$message({
          type: "success",
          message: "修改成功"
        });
      });
    },
    editBook(book) {
      this.$prompt("请输入书本名称", "提示", {
        inputValue: book.title,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async ({ value }) => {
        let resp = await post("/book/edit", { book_id: book.id, title: value });
        console.log(resp);
        this.load();
        this.$message({
          type: "success",
          message: "修改成功"
        });
      });
    },
    deleteBook(book) {
      this.$confirm(`此操作将永久删除${book.title}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let resp = await post("/book/delete", { book_id: book.id });
        console.log(resp);
        this.load();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.action {
  display: inline;
  position: fixed;
  right: 30px;
  top: 60px;
}
.books {
  user-select: none;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px 48px;
  .book {
    &:hover {
      box-shadow: 2px 2px 2px #dae9ff;
      background-color: rgb(217, 232, 250);
      border: 1px solid #accaf7;
    }
    position: relative;
    width: 120px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 800;
    border: 1px solid #d4d4d4;
    height: 148px;
    cursor: pointer;
    margin: 24px 24px 24px 0;
    box-shadow: 2px 2px 2px #e6e6e6;
    background-color: rgb(247, 247, 247);
    .book-title {
      margin: 50px 0 0 0;
      width: 120px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      user-select: none;
    }
    .book-date {
      font-weight: 100;
      font-size: 12px;
      color: #969292;
    }
    .book-tool {
      position: absolute;
      bottom: 5px;
      right: 10px;
      display: none;

      i {
        font-size: 18px;
        margin: 0 0 0 5px;
        &:hover {
          color: red;
        }
      }
    }
    &:hover .book-tool {
      display: inherit;
    }
  }
}
</style>
