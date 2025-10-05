import AutoIncrementalPanelIndex from "./autoIncrementalPanelIndex";

type TPlacement = "stacked" | "aligned";
type PanelNodeObject = {
  placement?: TPlacement,
  gridTemplate?: string[],
  gridStart?: number,
  gridSpan?: number,
  panelName: string,
  resizable?: boolean,
  className?: string,
  children?: PanelNodeObject[]
};

type GridLayout = {
  panelId: number,
  panelName: string,
  parentPanelId: number,
  gridTemplateColumns: string[],
  gridTemplateRows: string[],
  gridRowStart: number,
  gridRowEnd: number,
  gridColumnStart: number,
  gridColumnEnd: number,
  resizable: boolean,
  children: GridLayout[]
}

export default class PanelNode {
  private panelId: number;
  private children: PanelNode[] = [];
  
  private constructor(
    private parentPanel: PanelNode | null,
    private placement: TPlacement,
    private gridTemplate: string[] | null,
    private gridStart: number | null,
    private gridSpan: number,
    private resizable: boolean,
    private readonly panelName: string,
    private readonly className: string,
  ) {
    this.panelId = AutoIncrementalPanelIndex.getNext();
  }

  clone(): PanelNode {
    const cloned = new PanelNode(
      null,
      this.placement,
      this.gridTemplate,
      this.gridStart,
      this.gridSpan,
      this.resizable,
      this.panelName,
      this.className
    ).setPanelId(this.panelId);

    cloned.children = this.children.map(child => {
      const clonedChild = child.clone()
        .setParentPanel(cloned);
      return clonedChild;
    });

    return cloned;
  }


  addChildren(children: PanelNodeObject[]) {
    children.forEach(child => this.children.push(
      PanelNode.objectToPanelNode(this, child)
    ));
  }

  removeChild(childPanelId: number): boolean {
    const index = this.children.findIndex(child => child.panelId === childPanelId);
    if (index !== -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;

  }

  static objectToPanelNode(
    parentPanel: PanelNode,
    obj: PanelNodeObject
  ): PanelNode {
    const panelNode = new PanelNode(
      parentPanel,
      obj.placement ?? "aligned",
      obj.gridTemplate ?? null,
      obj.gridStart ?? null,
      obj.gridSpan ?? 1,
      parentPanel && !!window.getComputedStyle && (obj.resizable ?? true),
      obj.panelName,
      obj.className ?? ""
    );
    panelNode.addChildren(obj.children ?? []);
    return panelNode;
  }

  private setPanelId(panelId: number): PanelNode {
    this.panelId = panelId;
    return this;
  }

  private setParentPanel(parentPanel: PanelNode): PanelNode {
    this.parentPanel = parentPanel;
    return this;
  }

  private getParentPlacement(): TPlacement | null {
    return this.parentPanel?.placement || null;
  }

  getGridLayout(): GridLayout {
    const gridTemplateRows = this.gridTemplate === null
      ? [] : this.placement === "stacked" ? this.gridTemplate : ["1fr"];
    const gridTemplateColumns = this.gridTemplate === null
      ? [] : this.placement === "aligned" ? this.gridTemplate : ["1fr"];
    
    const gridRowStart = this.parentPanel === null || this.gridStart === null
      ? 0 : this.getParentPlacement() === "stacked" ? this.gridStart : 1;
    
    const gridRowEnd = this.parentPanel === null || this.gridStart === null
      ? 0 : this.getParentPlacement() === "stacked" ? this.gridStart + 1 : -1;
    
    const gridColumnStart = this.parentPanel === null || this.gridStart === null
      ? 0 : this.getParentPlacement() === "aligned" ? this.gridStart : 1;
    
    const gridColumnEnd = this.parentPanel === null || this.gridStart === null
      ? 0 : this.getParentPlacement() === "aligned" ? this.gridStart + 1 : -1;
    
    return {
      panelId: 0, // Do
      panelName: "",  // Do
      parentPanelId: 0, // Do
      gridTemplateColumns,
      gridTemplateRows,
      gridRowStart,
      gridRowEnd,
      gridColumnStart,
      gridColumnEnd,
      children: this.children.map(child => child.getGridLayout()),
      resizable: this.resizable,
    }
  }
}