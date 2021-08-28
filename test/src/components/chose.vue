<style>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
  float: left;
}

li a,
.dropbtn {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 50px;
}
/* li a:hover, */
.dropdown:hover,
.dropbtn {
  background-color: #111;
  font-size: 50px;
 
}

.dropdown {
  display: inline-block;
  font-size: 50px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
   z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {
  background-color: #f1f1f1;
}
.dropdown:hover .dropdown-content {
  display: block;
}
#chart {
  position: absolute;
  width: 85%;
  height: 90%;
  top: 8%;
  left: 15%;
}
#task_chart {
  width: 100%;
  height: 30%;
}
#tasks {
  width: 15%;
  height: 93.4%;
  border-color: black;
  border-style: solid;
  border-block-color: black;
  border-width: 2px;
  top: 6%;
  /* position: absolute; */
  /* position:relative; */
}
</style>
  <template>
  <div>
    <ul>
      <div class="dropdown">
        <a href="#" class="dropbtn">任务</a>
        <div class="dropdown-content" id="taskss">
          <a href="#" id="1" @click.prevent="commits(1)">任务1</a>
          <a href="#" id="2" @click.prevent="commits(2)">任务2</a>
          <a href="#" id="3" @click.prevent="commits(3)">任务3</a>
          <a href="#" id="4" @click.prevent="commits(4)">任务4</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="#" class="dropbtn">视图</a>
        <div class="dropdown-content" id="charts">
          <a href="#" id="1Icicle">图1</a>
          <a href="#" id="2Circlepack">图2</a>
          <a href="#" id="3linktree">图3</a>
          <a href="#" id="4Radialtree">图4</a>
          <a href="#" id="5Sunburst">图5</a>
          <a href="#" id="6Treemap">图6</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="#" class="dropbtn">测试数据</a>
        <div class="dropdown-content" id="data">
          <a href="#" id="1">数据1</a>
          <a href="#" id="2">数据2</a>
          <a href="#" id="3">数据3</a>
          <a href="#" id="4">数据4</a>
          <a href="#" id="5">数据5</a>
          <a href="#" id="6">数据6</a>
        </div>
      </div>
    </ul>
    <div id="chart"></div>
  </div>
</template>
  <script>
import * as d3 from "d3";
export default {
  methods: {
    commits(number) {
      this.$store.commit("set_isShow", number);
    },
    init() {
      let divchart = document.getElementById("charts");
      let that = this;
      // d3.selectAll('.dropdown').style('pointer-events','none').style('cursor','default')
      // d3.selectAll('.dropdown').style('pointer-events','auto').style('cursor','default')
      divchart.addEventListener("click", function (e) {
        // divchart.removeEventListener();
        let num = parseInt(e.target.id);
        that.$store.commit("set_select_chart", num);
      });
      let divtasks = document.getElementById("taskss");
      divtasks.addEventListener("click", function (item) {
        let nums = parseInt(item.target.id);
        //console.log(nums);
        that.$store.commit("set_select_tasks", nums);
      });

      let data_task = document.getElementById("data");

      data_task.addEventListener("click", function (item) {
        let numes = parseInt(item.target.id);
        console.log(item.target.id);
        that.$store.commit("set_select_data_id", numes);
      });
    },
  },
  mounted() {
    this.commits();
    this.init();
  },
  computed: {
    select_chart() {
      return this.$store.getters.get_select_chart;
    },
    select_chart() {
      return this.$store.getters.get_select_tasks;
    },
    select_data_id() {
      return this.$store.getters.get_select_data_id;
    },
  },
  watch: {
    // select_chart(id) {},
    // select_tasks(id) {},
    //start_state(start_state){},
  },
};
</script>