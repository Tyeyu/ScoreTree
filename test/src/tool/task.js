import store from "../store/index"
import * as d3 from "d3";
const task = {
    task_0: function (now_chart_id, now_task_id) {
        let start_time = store.getters.get_start_time;
        let end_time = store.getters.get_end_time;
        let now_id = store.getters.get_select_data_id;
        let result = {
            chart_id: null,
            task_id: null,
            now_data_id: null,
            finish_time: null
        }
        result.chart_id = now_chart_id;
        result.task_id = now_task_id;
        result.now_data_id = now_id;
        result.finish_time = (end_time - start_time) / 1000;
        console.log(result.finish_time);
        store.commit('set_result', result);
        store.commit("set_start_state", null);
        store.commit("set_finish_state",1);
        d3.selectAll('.dropdown').style('pointer-events', 'auto').style('cursor', 'default');
        d3.selectAll('#tasks').style('pointer-events', 'auto').style('cursor', 'default');
        return true;
    },
    task_1: function (now_chart_id, now_task_id) {
        let start_time = store.getters.get_start_time;
        let end_time = store.getters.get_end_time;
        let now_id = store.getters.get_select_data_id;
        let result = {
            chart_id: null,
            task_id: null,
            now_data_id: null,
            finish_time: null
        }
        result.chart_id = now_chart_id;
        result.task_id = now_task_id;
        result.now_data_id = now_id;
        result.finish_time = (end_time - start_time) / 1000;
        console.log(result.finish_time);
        store.commit('set_result', result);
        alert("恭喜您花费" + result.finish_time + "s" + "完成任务");
        store.commit("set_start_state", null);
        store.commit("set_finish_state",1);
        d3.selectAll('.dropdown').style('pointer-events', 'auto').style('cursor', 'default');
        d3.selectAll('#tasks').style('pointer-events', 'auto').style('cursor', 'default');
        return true;
    },
    task_2: function (now_depth, now_length) {
        let d_state = store.getters.get_depth_state;
        let depth = store.getters.get_depth;
        let length = store.getters.get_max_length;
        let flag = 0;
        console.log("max_length",length);
        if (d_state == 0) {
            if (now_depth == depth || now_depth == depth - 1) {
                if (now_length == length) {
                    var end_time = new Date();
                    flag = 1;
                }
            }
        };
        if (d_state == 1) {
            if (now_depth == depth || now_depth == depth + 1) {
                if (now_length == length) {
                    var end_time = new Date();
                    flag = 1;
                }
            }
        };
        if (flag == 1) {
            let result = {
                chart_id: store.getters.get_select_chart,
                task_id: store.getters.get_select_tasks,
                now_data_id: store.getters.get_select_data_id,
                finish_time: (end_time - store.getters.get_start_time) / 1000,
            };
            store.commit('set_result', result);
            alert("恭喜您花费" + result.finish_time + "s" + "完成任务");
            // store.commit("set_start_state", null);
            store.commit("set_depth_state",null);
            store.commit("set_finish_state",1);
            d3.selectAll('.dropdown').style('pointer-events', 'auto').style('cursor', 'default');
            d3.selectAll('#tasks').style('pointer-events', 'auto').style('cursor', 'default');
            return true;
        }
        else{
            return false;
        }
    }
}
export default task