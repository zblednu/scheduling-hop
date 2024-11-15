const fs = require("fs");

(function main() {
  const data = JSON.parse(fs.readFileSync("input.json", "utf8"));
  const output = []; 

  const devices = new Map();
  for (const dev of data.devices) {
    devices.set(dev, 0);
  }

  const incompleted = [...data.tasks];
  const completed = [];

  while (incompleted.length) {
    const availableTasks = formAvailableTasks();
    for (const task of availableTasks) {
      const dev = [...devices.keys()]
        .filter((element) => task.devices.includes(element))
        .reduce((min, elem) =>
          devices.get(elem) < devices.get(min) ? elem : min,
        );

      output.push(`${task.name},${dev},${devices.get(dev)}\n`);
      devices.set(dev, devices.get(dev) + task.duration);
      completed.push(task.name);
      incompleted.splice(incompleted.indexOf(task), 1);
    }
  }

  fs.writeFileSync("output.csv", output.join("") + "\n", "utf8");

  function formAvailableTasks() {
    const availableTasks = [];
    for (const task of incompleted) {
      if (task.prerequisites.every((item) => completed.includes(item))) {
        availableTasks.push(task);
      }
    }
    return availableTasks.sort((a, b) => a.devices.length - b.devices.length);
  }
})();
