"use strict";
goog.provide("Blockly.Blocks.fsus");
goog.require("Blockly.Blocks");
Blockly.Blocks.fsus.HUE = 300;

Blockly.Blocks["fsus_begin"] = {
  init: function () {
    this.tag = "fsus_begin";
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput().appendField(
      Blockly.FSUS_BEGIN + " " + Blockly.FSUS_SERVOS
    );
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(
        profile.default.serial_select,
        this.handleSelect.bind(this)
      ),
      "serial"
    );
    this.appendDummyInput("pins")
      .appendField("RX#")
      .appendField(new Blockly.FieldDropdown(profile.default.digital), "rx")
      .appendField("TX#")
      .appendField(new Blockly.FieldDropdown(profile.default.digital), "tx");
    this.appendDummyInput()
      .appendField(Blockly.FSUS_COUNT)
      .appendField(new Blockly.FieldNumber(1, 1, 255), "servo_number");
    this.serialName = this.getFieldValue("serial");
    this.isSoftwareSerial = !this.serialName.startsWith("Se");
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(Blockly.FSUS_TOOLTIP_BEGIN);
  },

  // onchange: function (changeEvent) {
  //   if (Blockly.Blocks.fsus.getInitObjectCount() <= 1) {
  //     this.setWarningText(null);
  //   } else {
  //     // this.setWarningText(Blockly.FSUS_NOT_MULITI_INIT);
  //     this.setWarningText("不能重复初始化！");
  //   }
  // },

  handleSelect: function (newSerial) {
    if (this.serialName !== newSerial) {
      this.serialName = newSerial;
      this.isSoftwareSerial = !this.serialName.startsWith("Se");
      if (this.isSoftwareSerial && newSerial !== "mySerial") {
        return null;
      }
      this.updateShape_();
    }
  },

  updateShape_: function () {
    this.getInput("pins").setVisible(this.isSoftwareSerial);
  },

  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("serialname", this.serialName);
    container.setAttribute("issoftwareserial", this.isSoftwareSerial);
    return container;
  },

  domToMutation: function (xmlElement) {
    var serialName = xmlElement.getAttribute("serialname");
    if (serialName && serialName !== "undefined") {
      this.serialName = serialName;
      this.isSoftwareSerial = !this.serialName.startsWith("Se");
    }
    this.updateShape_();
  },
};

Blockly.Blocks["servos_create_with_item"] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput().appendField("servo");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  },
};

Blockly.Blocks["servos_create_with_container"] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput().appendField(Blockly.FSUS_SERVOS);
    this.appendStatementInput("STACK");
    this.contextMenu = false;
  },
};

Blockly.Blocks["fsus_begin2"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput()
      .appendField(Blockly.FSUS_BEGIN + " " + Blockly.FSUS_SERVOS)
      .appendField(
        new Blockly.FieldDropdown(
          profile.default.serial_select,
          this.handleSelect.bind(this)
        ),
        "serial"
      );
    this.appendDummyInput("pins")
      .appendField("RX#")
      .appendField(new Blockly.FieldDropdown(profile.default.digital), "rx")
      .appendField("TX#")
      .appendField(new Blockly.FieldDropdown(profile.default.digital), "tx");
    this.itemCount_ = 1;
    this.serialName = this.getFieldValue("serial");
    this.isSoftwareSerial = !this.serialName.startsWith("Se");
    this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    this.setMutator(new Blockly.Mutator(["servos_create_with_item"]));
    this.setTooltip(Blockly.FSUS_TOOLTIP_BEGIN2);
  },

  handleSelect: function (newSerial) {
    if (this.serialName !== newSerial) {
      this.serialName = newSerial;
      this.isSoftwareSerial = !this.serialName.startsWith("Se");
      if (this.isSoftwareSerial && newSerial !== "mySerial") {
        return null;
      }
      this.updateShape_();
    }
  },

  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("items", this.itemCount_);
    container.setAttribute("serialname", this.serialName);
    container.setAttribute("issoftwareserial", this.isSoftwareSerial);
    return container;
  },

  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute("items"), 10);
    var serialName = xmlElement.getAttribute("serialname");
    if (serialName && serialName !== "undefined") {
      this.serialName = serialName;
      this.isSoftwareSerial = !this.serialName.startsWith("Se");
    }
    this.updateShape_();
  },

  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = Blockly.Block.obtain(
      workspace,
      "servos_create_with_container"
    );
    containerBlock.initSvg();
    var connection = containerBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(
        workspace,
        "servos_create_with_item"
      );
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput("SERVO_ID" + i).connection.connect(connections[i]);
      }
    }
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    var i = 0;
    while (itemBlock) {
      var input = this.getInput("SERVO_ID" + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function () {
    this.getInput("pins").setVisible(this.isSoftwareSerial);
    // Delete everything.
    if (this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else {
      var i = 0;
      while (this.getInput("SERVO_ID" + i)) {
        this.removeInput("SERVO_ID" + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput("EMPTY").appendField(
        Blockly.FSUS_SERVOS_CREATE_EMPTY_TITLE
      );
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput("SERVO_ID" + i);
        input.setAlign(Blockly.ALIGN_RIGHT);
        input.appendField("ID");
      }
    }
  },
};

Blockly.Blocks["fsus_wheel_stop"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput().appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput().appendField(Blockly.FSUS_STOP_ROTATE);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 轮式模式 舵机 ID [0] 转速 [100] °/s 转向 [转向选择]
Blockly.Blocks["fsus_wheel_run"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(
      Blockly.FSUS_WHEEL_MODE + " " + Blockly.FSUS_SERVO
    );
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("SERVO_SPEED")
      .setCheck(Number)
      .appendField(Blockly.FSUS_SPEED)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_DEGREE_PER_SECOND);
    this.appendDummyInput("").appendField(Blockly.FSUS_DIRECTION);
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.FSUS_CW, "FSUS_CW"],
          [Blockly.FSUS_CCW, "FSUS_CCW"],
        ]),
        "SERVO_ROTATE_DIRECTION"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 轮式模式 舵机 ID [0] 转速 [100] °/s 转向 [转向选择] 时间 [1000] 毫秒
Blockly.Blocks["fsus_wheel_run_time"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(
      Blockly.FSUS_WHEEL_MODE + " " + Blockly.FSUS_SERVO
    );
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("SERVO_SPEED")
      .setCheck(Number)
      .appendField(Blockly.FSUS_SPEED)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_DEGREE_PER_SECOND);
    this.appendDummyInput("")
      .appendField(Blockly.FSUS_DIRECTION)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.FSUS_CW, "FSUS_CW"],
          [Blockly.FSUS_CCW, "FSUS_CCW"],
        ]),
        "SERVO_ROTATE_DIRECTION"
      );
    this.appendValueInput("TIME_MS")
      .setCheck(Number)
      .appendField(Blockly.FSUS_TIME)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_TIME_MS);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 轮式模式 舵机 ID [0] 转速 [100] °/s 转向 [转向选择] 圈数 [2]
Blockly.Blocks["fsus_wheel_run_circle"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(
      Blockly.FSUS_WHEEL_MODE + " " + Blockly.FSUS_SERVO
    );
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("SERVO_SPEED")
      .setCheck(Number)
      .appendField(Blockly.FSUS_SPEED)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_DEGREE_PER_SECOND);
    this.appendDummyInput("")
      .appendField(Blockly.FSUS_DIRECTION)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.FSUS_CW, "FSUS_CW"],
          [Blockly.FSUS_CCW, "FSUS_CCW"],
        ]),
        "SERVO_ROTATE_DIRECTION"
      );
    this.appendValueInput("CIRCLE")
      .setCheck(Number)
      .appendField(Blockly.FSUS_CIRCLE_COUNT)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 舵机 ID [0] 读取 [角度类型]
Blockly.Blocks["fsus_read_angle"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID").setCheck(Number).appendField("ID");
    this.appendDummyInput("")
      .appendField(Blockly.FSUS_READ)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.FSUS_REAL_ANGLE, "angleReal"],
          [Blockly.FSUS_RAW_ANGLE, "angleRaw"],
          [Blockly.FSUS_MIN_ANGLE, "angleMin"],
          [Blockly.FSUS_MAX_ANGLE, "angleMax"],
          [Blockly.FSUS_TARGET_ANGLE, "targetAngle"],
        ]),
        "ANGLE_TYPE"
      );
    this.setInputsInline(true);
    this.setOutput(true);
  },
};

// ID [0] 角度 [angle] 转速 [100] 度/秒 [是否等待]
Blockly.Blocks["fsus_set_angle"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("SERVO_ANGLE")
      .setCheck(Number)
      .appendField(Blockly.FSUS_DEGREE)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField("°");
    this.appendValueInput("SERVO_SPEED")
      .setCheck(Number)
      .appendField(Blockly.FSUS_SPEED)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_DEGREE_PER_SECOND);
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.FSUS_WAIT, "wait"],
          [Blockly.FSUS_NO_WAIT, "no_wait"],
        ]),
        "SERVO_WAIT"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 舵机 ID [0] 设置角度范围 最小 [minAngle] ° 最大 [maxAngle] °
Blockly.Blocks["fsus_set_angle_range"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_SET_ANGLE_RANGE);
    this.appendValueInput("SERVO_ANGLE_MIN")
      .setCheck(Number)
      .appendField(Blockly.FSUS_MIN)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField("°");
    this.appendValueInput("SERVO_ANGLE_MAX")
      .setCheck(Number)
      .appendField(Blockly.FSUS_MAX)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField("°");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 舵机 ID [0] 设置转速 [speed] 度/秒
Blockly.Blocks["fsus_set_speed"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("SERVO_SPEED")
      .setCheck(Number)
      .appendField(Blockly.FSUS_SET_SPEED)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_DEGREE_PER_SECOND);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 舵机 ID [0] [开启或关闭选择] 扭力
Blockly.Blocks["fsus_set_torque"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.FSUS_TORQUE_OPEN, "true"],
          [Blockly.FSUS_TORQUE_CLOSE, "false"],
        ]),
        "SERVO_TORQUE"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 舵机 ID [0]  设置阻尼 功率 [800] mW
Blockly.Blocks["fsus_set_damping"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("SERVO_DAMPING")
      .setCheck(Number)
      .appendField(Blockly.FSUS_SET_DAMPING)
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField("mW");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
  },
};

// 舵机 ID [0] 是否在线
Blockly.Blocks["fsus_ping"] = {
  init: function () {
    this.setColour(Blockly.Blocks.fsus.HUE);
    this.appendDummyInput("").appendField(Blockly.FSUS_SERVO);
    this.appendValueInput("SERVO_ID")
      .setCheck(Number)
      .appendField("ID")
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput("").appendField(Blockly.FSUS_IS_ONLINE);
    this.setInputsInline(true);
    this.setOutput(true);
  },
};
