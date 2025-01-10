import { FC, useEffect, useRef, useState } from 'react';
import { Form, Input, InputNumber, Checkbox, Space, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { EPartName, TTree } from '@/models';
import { Observer, TMessage } from '@/util/observer';
import RefPicker from '@/components/Ref';
import CustomDatePick from '@/components/CustomDatePick';
import CustomTimePicker from '@/components/CustomTimePicker';
import {} from '../../../models';
import { getRefByAttr } from '@/util';
import { billformConf, subject } from '../../../conf';
import { actions, toEdit, save, reflesh } from './store';
import {
  useEditStatusInfo,
  useFormData,
  useIdUiConf,
  useFgDisabled,
} from './hooks';
