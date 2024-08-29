import { ChartModel } from '../../model/chart-model';
import { Coordinate } from '../../model/coordinate';
import { CustomRectangle } from '../../model/custom-rectangle';
import { Series } from '../../model/series';
import { IPaneRenderer } from '../../renderers/ipane-renderer';
import { RectangleRenderer, RectangleRendererData } from '../../renderers/rectangle-renderer';

import { IPaneView } from './ipane-view';

export class CustomRectangleView implements IPaneView {
	protected readonly _rectRendererData: RectangleRendererData = {
		x0: 0 as Coordinate,
		y0: 0 as Coordinate,
		x1: 0 as Coordinate,
		y1: 0 as Coordinate,
		fillColor: 'rgba(0, 0, 0, 0)',
		borderColor: 'rgba(0, 0, 0, 0)',
		visible: false,
	};

	protected readonly _series: Series;
	protected readonly _model: ChartModel;
	protected readonly _rectRenderer: RectangleRenderer = new RectangleRenderer();
	private _invalidated: boolean = true;

	private readonly _rect: CustomRectangle;

	public constructor(series: Series, rect: CustomRectangle) {
		this._series = series;
		this._rect = rect;
		this._model = series.model();
		this._rectRenderer.setData(this._rectRendererData);
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
		return this._rectRenderer;
	}

	protected _updateImpl(): void {
		const data = this._rectRendererData;
		data.visible = false;

		const lineOptions = this._rect.options();

		if (!this._series.visible()) {
			return;
		}

		const x0 = this._rect.x0Coord();
		const y0 = this._rect.y0Coord();
		const x1 = this._rect.x1Coord();
		const y1 = this._rect.y1Coord();

		if (x0 === null || y0 === null || x1 === null || y1 === null) {
			return;
		}

		data.visible = true;
		data.x0 = x0;
		data.y0 = y0;
		data.x1 = x1;
		data.y1 = y1;
		data.fillColor = lineOptions.fillColor;
		data.borderColor = lineOptions.borderColor;
		data.externalId = this._rect.options().id;
	}
}
