import AutoIncrementalPanelIndex from "./autoIncrementalPanelIndex";

type TPlacement = "stacked" | "aligned";
type PanelNodeObject = {
  placement: TPlacement,
  gridTemplate: string[] | null,
  gridStart: number | null,
  panelName: string,
  className?: string,
  items: PanelNodeObject[]
};

type GridLayout = {
  gridTemplateColumns: string[],
  gridTemplateRows: string[],
  gridRowStart: number,
  gridRowEnd: number,
  gridColumnStart: number,
  gridColumnEnd: number,
  resizable: boolean
}

export default class PanelNode {
  private panelId: number;
  private children: PanelNode[] = [];
  
  constructor(
    private parentPanel: PanelNode | null,
    private placement: TPlacement,
    private gridTemplate: string[] | null,
    private gridStart: number | null,
    private readonly panelName: string,
    private readonly className?: string,
  ) {
    this.panelId = AutoIncrementalPanelIndex.getNext();
  }

  clone(): PanelNode {
    const cloned = new PanelNode(
      null,
      this.placement,
      this.gridTemplate,
      this.gridStart,
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
      PanelNode.objectToPanelNode(
        this,
        child
      )
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

  private static objectToPanelNode(
    parentPanel: PanelNode,
    obj: PanelNodeObject
  ): PanelNode {
    return new PanelNode(
      parentPanel,
      obj.placement,
      obj.gridTemplate,
      obj.gridStart,
      // There is an error so start here
    )
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

  getGridLayout(): object {
    // TODO: Implement
    return {}
  }
}