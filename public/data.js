// 抽签数据文件
// 数据结构：包含候选项信息（姓名、编号等）

const lotteryData = [
  { id: 1, name: '张三', number: '001' },
  { id: 2, name: '李四', number: '002' },
  { id: 3, name: '王五', number: '003' },
  { id: 4, name: '赵六', number: '004' },
  { id: 5, name: '钱七', number: '005' },
  { id: 6, name: '孙八', number: '006' },
  { id: 7, name: '周九', number: '007' },
  { id: 8, name: '吴十', number: '008' },
  { id: 9, name: '郑十一', number: '009' },
  { id: 10, name: '王十二', number: '010' },
  { id: 11, name: '冯十三', number: '011' },
  { id: 12, name: '陈十四', number: '012' },
  { id: 13, name: '褚十五', number: '013' },
  { id: 14, name: '卫十六', number: '014' },
  { id: 15, name: '蒋十七', number: '015' },
  { id: 16, name: '沈十八', number: '016' },
  { id: 17, name: '韩十九', number: '017' },
  { id: 18, name: '杨二十', number: '018' },
  { id: 19, name: '朱二一', number: '019' },
  { id: 20, name: '秦二二', number: '020' },
];

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { lotteryData };
} else {
  window.lotteryData = lotteryData;
}
