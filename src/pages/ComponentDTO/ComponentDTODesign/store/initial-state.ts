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
    zoomLevel: 100,
    goToId: undefined,
  },
  diagramUi: {
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
  },
  addElementStatus: undefined,
  fgInit: true,
  status: 'idle',
  dtoCollection: {
    action: DOStatus.UNCHANGED,
    idDtoEntityCollection: '',
    deAssociates: [],
    dtoEntities: [],
    dtoNodeUis: [],
    dtoEnums: [],
    dtoEnumAssociates: [],
    sysDataTypes: [],
  },
  currentSelect: {
    concreteType: EnumConcreteDiagramType.EMPTY,
  },
  selectLines: [],
  selectNodes: [],
  focusIds: [],
  drawCount: 1,
  focusDrawCount: 0,
  zoomToFitCount: 0,
};

export const resetState = (state: TModuleStore) => {
  state.addElementStatus = undefined;
  state.fgInit = true;
  state.status = 'idle';
  state.dtoCollection = {
    action: DOStatus.UNCHANGED,
    idDtoEntityCollection: '',
    deAssociates: [],
    dtoEntities: [],
    dtoNodeUis: [],
    dtoEnums: [],
    dtoEnumAssociates: [],
    sysDataTypes: [],
  };
  state.currentSelect = {
    concreteType: EnumConcreteDiagramType.EMPTY,
  };
  state.selectLines = [];
  state.selectNodes = [];
  state.focusIds = [];
  state.drawCount = 0;
  state.focusDrawCount = 0;
  state.zoomToFitCount = 0;
};

export default initialState;
