// The prebuilt cartesian Plotly bundle ships without types; only the calls we use.
declare module "plotly.js-cartesian-dist-min" {
  type PlotlyObject = Record<string, unknown>;
  const Plotly: {
    react(el: HTMLElement, data: PlotlyObject[], layout?: PlotlyObject, config?: PlotlyObject): Promise<unknown>;
    purge(el: HTMLElement): void;
    Plots: { resize(el: HTMLElement): void };
  };
  export default Plotly;
}
