# To replicate:

- node.js v18 or higher required (`apt install nodejs`)
- clone this repo
- cd into the directory and run `node script.js` 
- output will be written to `output.csv`

# Analysis:

Given task is a scheduling problem. My solution uses greedy approach, that is to schedule processes in such way that is the best at the current moment. 

# Algorithm:

1. From incompleted tasks form a list of tasks that can be scheduled immediately, i.e. such tasks whose prerequisites are met.
1. Schedule tasks from the created list one by one, prioritizing those with lower number of available devices to run on (the other approach is to first schedule the longest-running tasks, though during my experiments with `input.csv` this has shown worse results). Delegate selected task to the device with lowest uptime at the moment.
1. Repeat until there are incompleted tasks.

# Code explanations:

## `devices` is a dictionary with key-value pairs of (device name, uptime)
```js
const devices = new Map();
for (const dev of data.devices) {
  devices.set(dev, 0);
}
```

## Scheduling loop

`dev` is the device with minimal uptime suitable for executing `task`: 
- `.filter` filters out devices not found in the `task.devices`, returns list of devices
- `.reduce` reduces the created list to one element - device with the lowest uptime 
```js
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
```

After that, operation is written to output, uptime of the selected devices is incremented, and the task is marked as complete


## formAvailableTasks function

`formAvailableTasks` goes through the incompleted tasks, adding tasks with completed prerequisited to availableTasks list, then sorts it so that more sophisticated tasks will be scheduled earlier in the scheduling loop
```js
function formAvailableTasks() {
  const availableTasks = [];
  for (const task of incompleted) {
    if (task.prerequisites.every((item) => completed.includes(item))) {
      availableTasks.push(task);
    }
  }
  return availableTasks.sort((a, b) => a.devices.length - b.devices.length);
}
```
