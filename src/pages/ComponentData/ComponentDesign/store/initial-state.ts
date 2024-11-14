import { DOStatus } from '@/models';
import { EnumCanvasUi, EnumConcreteDiagramType } from '../conf';
import { TModuleStore } from '../models';

const initialState: TModuleStore = {
  moduleUi: {
    cWidth: 0,
    cHeight: 0,
    hHeight: 20,
    lWidth: EnumCanvasUi.lWidth,
    rWidth: EnumCanvasUi.rWidth,
    bHeight: EnumCanvasUi.bHeight,
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
    zoomLevel: 100,
    goToId: undefined,
  },
  fgInit: true,
  status: 'idle',
  component: {
    action: DOStatus.UNCHANGED,
    idComponent: '',
    componentEntityAssociates: [],
    componentEntities: [],
    componentEnums: [],
    componentNodeUis: [],
    outEntities: [],
    enums: [],
    enumAssociates: [],
    outEnums: [],
    sysDataTypes: [],
  },
  currentSelect: {
    concreteType: EnumConcreteDiagramType.EMPTY,
  },
  fgShowOutEntities: false,
  fgShowSysInterfaces: false,
  selectLines: [],
  selectNodes: [],
  focusIds: [],
  drawCount: 1,
  focusDrawCount: 0,
  zoomToFitCount: 0,
};

export const resetState = (state: TModuleStore) => {
  state.fgInit = true;
  state.status = 'idle';
  state.component = {
    action: DOStatus.UNCHANGED,
    idComponent: '',
    componentEntityAssociates: [],
    componentEntities: [],
    componentEnums: [],
    componentNodeUis: [],
    outEntities: [],
    enums: [],
    enumAssociates: [],
    outEnums: [],
    sysDataTypes: [],
  };
  state.currentSelect = {
    concreteType: EnumConcreteDiagramType.EMPTY,
  };
  state.fgShowOutEntities = false;
  state.fgShowSysInterfaces = false;
  state.selectLines = [];
  state.selectNodes = [];
  state.focusIds = [];
  state.drawCount = 0;
  state.focusDrawCount = 0;
  state.zoomToFitCount = 0;
};

export default initialState;
