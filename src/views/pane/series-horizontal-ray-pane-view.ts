import { IChartModelBase } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { ISeries } from '../../model/series';
import { SeriesType } from '../../model/series-options';
import { LineStyle } from '../../renderers/draw-line';
import { HorizontalRayRenderer, HorizontalRayRendererData } from '../../renderers/horizontal-ray-renderer';
import { IPaneRenderer } from '../../renderers/ipane-renderer';

import { IPaneView } from './ipane-view';

export abstract class SeriesHorizontalRayPaneView implements IPaneView {
	protected readonly _lineRendererData: HorizontalRayRendererData = {
		y: 0 as Coordinate,
		x0: 0 as Coordinate,
		color: 'rgba(0, 0, 0, 0)',
		lineWidth: 1,
		lineStyle: LineStyle.Solid,
		visible: false,
	};

	protected readonly _series: ISeries<SeriesType>;
	protected readonly _model: IChartModelBase;
	protected readonly _lineRenderer: HorizontalRayRenderer = new HorizontalRayRenderer();
	private _invalidated: boolean = true;

	protected constructor(series: ISeries<SeriesType>) {
		this._series = series;
		this._model = series.model();
		this._lineRenderer.setData(this._lineRendererData);
	}

	public update(): void {
		this._invalidated = true;
	}

	public renderer(): IPaneRenderer | null {
		if (!this._series.visible()) {
			return null;
		}

		if (this._invalidated) {
			this._updateImpl();
			this._invalidated = false;
		}
		return this._lineRenderer;
	}

	protected abstract _updateImpl(): void;
}
