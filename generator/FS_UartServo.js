"use strict";
goog.provide("Blockly.Arduino.fsus");
goog.require("Blockly.Arduino");

Blockly.Arduino.fsus_begin = function () {
  var serial = this.getFieldValue('serial');
  var rx = this.getFieldValue('rx');
  var tx = this.getFieldValue('tx');
  var servo_number = this.getFieldValue('servo_number');

  if (this.isSoftwareSerial) {
    Blockly.Arduino.definitions_['include_SoftwareSerial'] = '#include <SoftwareSerial.h>';
    Blockly.Arduino.definitions_['SoftwareSerial'] = 'SoftwareSerial mySerial(' + rx + ', ' + tx + ');';
    serial = 'mySerial';
  } 

  Blockly.Arduino.definitions_['include_FashionStar_UartServoProtocal'] = '#include <FashionStar_UartServoProtocal.h>';
  Blockly.Arduino.definitions_['include_FashionStar_UartServo'] = '#include <FashionStar_UartServo.h>\n';

  Blockly.Arduino.definitions_['FSUS_Protocal'] = 'FSUS_Protocal protocal(115200);';

  var servo_definitions_code = '';
  var servo_init_code = '';

  for (i = 0; i < servo_number; i++) {
    servo_definitions_code = servo_definitions_code + 'FSUS_Servo uservo_' + i + '(' + i + ', &protocal);\n';
    servo_init_code = servo_init_code + 'uservo_' + i + '.init();\n  ';
  }
  Blockly.Arduino.definitions_['FSUS_Servo'] = servo_definitions_code;

  Blockly.Arduino.setups_['setup_protocal_init'] = 'protocal.init();';
  // Blockly.Arduino.setups_['setup_protocal_init'] = 'protocal.init(&' + serial + ', 115200);';

  Blockly.Arduino.setups_['setup_servo_init'] = servo_init_code;

	return '';
};


Blockly.Arduino.fsus_begin2 = function() {
  var serial = this.getFieldValue('serial');
  var rx = this.getFieldValue('rx');
  var tx = this.getFieldValue('tx');

  if (this.isSoftwareSerial) {
    Blockly.Arduino.definitions_['include_SoftwareSerial'] = '#include <SoftwareSerial.h>';
    Blockly.Arduino.definitions_['SoftwareSerial'] = 'SoftwareSerial mySerial(' + rx + ', ' + tx + ');';
    serial = 'mySerial';
  } 

  Blockly.Arduino.definitions_['include_FashionStar_UartServoProtocal'] = '#include <FashionStar_UartServoProtocal.h>';
  Blockly.Arduino.definitions_['include_FashionStar_UartServo'] = '#include <FashionStar_UartServo.h>';
  Blockly.Arduino.definitions_['FSUS_Protocal'] = 'FSUS_Protocal protocal(115200);';

  var code = new Array(this.itemCount_);
  var servo_definitions_code = '';
  var servo_init_code = '';

  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.Arduino.valueToCode(this, 'SERVO_ID' + n, Blockly.Arduino.ORDER_NONE) || '0';
    servo_definitions_code = servo_definitions_code + 'FSUS_Servo uservo_' + code[n] + '(' + code[n] + ', &protocal);\n';
    servo_init_code = servo_init_code + 'uservo_' + code[n] + '.init();\n  ';
  }

  Blockly.Arduino.definitions_['FSUS_Servo'] = servo_definitions_code;
  Blockly.Arduino.setups_['setup_protocal_init'] = 'protocal.init();';
  // Blockly.Arduino.setups_['setup_protocal_init'] = 'protocal.init(&' + serial + ', 115200);';
  Blockly.Arduino.setups_['setup_servo_init'] = servo_init_code;

  return '';
};


Blockly.Arduino.fsus_wheel_stop = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var code = 'uservo_' + servo_id + '.wheelStop();\n';
  return code;
}

// 轮式模式 舵机 ID [0] 转速 [100] °/s 转向 [转向选择]
Blockly.Arduino.fsus_wheel_run = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_speed = Blockly.Arduino.valueToCode(this, "SERVO_SPEED", Blockly.Arduino.ORDER_ATOMIC);
  var dir = this.getFieldValue('SERVO_ROTATE_DIRECTION');
  var code = 'uservo_' + servo_id + '.setSpeed(' + servo_speed + ');\n';
  code = code + 'uservo_' + servo_id + '.wheelRun(' + dir + ');\n';
  return code;
}

// 轮式模式 舵机 ID [0] 转速 [100] °/s 转向 [转向选择] 时间 [5000] 毫秒
Blockly.Arduino.fsus_wheel_run_time = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_speed = Blockly.Arduino.valueToCode(this, "SERVO_SPEED", Blockly.Arduino.ORDER_ATOMIC);
  var time_ms = Blockly.Arduino.valueToCode(this, "TIME_MS", Blockly.Arduino.ORDER_ATOMIC);
  var dir = this.getFieldValue('SERVO_ROTATE_DIRECTION');
  var code = 'uservo_' + servo_id + '.setSpeed(' + servo_speed + ');\n';
  code = code + 'uservo_' + servo_id + '.wheelRunNTime(' + dir + ', ' + time_ms + ');\n';
  code = code + 'delay(' + time_ms + ');\n'
  // code = code + 'uservo_' + servo_id + '.wheelStop();\n';
  return code;
}

// 轮式模式 舵机 ID [0] 转速 [100] °/s 转向 [转向选择] 圈数 [2]
Blockly.Arduino.fsus_wheel_run_circle = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_speed = Blockly.Arduino.valueToCode(this, "SERVO_SPEED", Blockly.Arduino.ORDER_ATOMIC);
  var circle = Blockly.Arduino.valueToCode(this, "CIRCLE", Blockly.Arduino.ORDER_ATOMIC);
  var dir = this.getFieldValue('SERVO_ROTATE_DIRECTION');
  var code = 'uservo_' + servo_id + '.setSpeed(' + servo_speed + ');\n';
  code = code + 'uservo_' + servo_id + '.wheelRunNCircle(' + dir + ', ' + circle + ');\n';
  // code = code + 'delay(360.0*' + circle + '/uservo_' + servo_id + '.speed' + '*1000);\n';
  code = code + 'delay(360.0*' + circle + '/' + servo_speed + '*1000);\n';
  return code;
}

// 舵机 ID [0] 读取 [角度类型]
Blockly.Arduino.fsus_read_angle = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var angle_type = this.getFieldValue("ANGLE_TYPE");
  var code = '';

  if (angle_type == 'angleReal') {
    code = 'uservo_' + servo_id + '.angleRaw2Real(uservo_' + servo_id + '.queryRawAngle())';
  } else if (angle_type == 'angleRaw') {
    code = 'uservo_' + servo_id + '.queryRawAngle()';
  } else {
    code = 'uservo_' + servo_id + '.' + angle_type;
  }

  return [code, Blockly.Arduino.ORDER_ATOMIC];
}

// ID [0] 角度 [angle] 转速 [100] 度/秒 [是否等待]
Blockly.Arduino.fsus_set_angle = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_angle = Blockly.Arduino.valueToCode(this, "SERVO_ANGLE", Blockly.Arduino.ORDER_ATOMIC);
  var servo_speed = Blockly.Arduino.valueToCode(this, "SERVO_SPEED", Blockly.Arduino.ORDER_ATOMIC);
  var servo_wait = this.getFieldValue("SERVO_WAIT");
  var code = 'uservo_' + servo_id + '.setSpeed(' + servo_speed + ');\n';
  code = code + 'uservo_' + servo_id + '.setAngle(' + servo_angle + ');\n';

  if (servo_wait == "wait") {
    code = code + 'uservo_' + servo_id + '.wait();\n';
  }

  return code;
}

// 舵机 ID [0] 设置角度范围 最小 [minAngle] ° 最大 [maxAngle] °
Blockly.Arduino.fsus_set_angle_range = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var min_angle = Blockly.Arduino.valueToCode(this, "SERVO_ANGLE_MIN", Blockly.Arduino.ORDER_ATOMIC);
  var max_angle = Blockly.Arduino.valueToCode(this, "SERVO_ANGLE_MAX", Blockly.Arduino.ORDER_ATOMIC);
  var code = 'uservo_' + servo_id + '.setAngleRange(' + min_angle + ', ' + max_angle + ');\n';
  return code;
}

// 舵机 ID [0] 设置转速 [speed] 度/秒
Blockly.Arduino.fsus_set_speed = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_speed = Blockly.Arduino.valueToCode(this, "SERVO_SPEED", Blockly.Arduino.ORDER_ATOMIC);
  var code = 'uservo_' + servo_id + '.setSpeed(' + servo_speed + ');\n';
  return code;
}

// 舵机 ID [0] [开启或关闭选择] 扭力
Blockly.Arduino.fsus_set_torque = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_torque = this.getFieldValue("SERVO_TORQUE");
  var code = 'uservo_' + servo_id + '.setTorque(' + servo_torque + ');\n';
  return code;
}

// 舵机 ID [0]  设置阻尼 [800] mW
Blockly.Arduino.fsus_set_damping = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var servo_damping = Blockly.Arduino.valueToCode(this, "SERVO_DAMPING", Blockly.Arduino.ORDER_ATOMIC);
  var code = 'uservo_' + servo_id + '.setDamping(' + servo_damping + ');\n';
  return code;
}

// 舵机 ID [0] 是否在线
Blockly.Arduino.fsus_ping = function () {
  var servo_id = Blockly.Arduino.valueToCode(this, "SERVO_ID", Blockly.Arduino.ORDER_ATOMIC);
  var code = 'uservo_' + servo_id + '.ping()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
}





