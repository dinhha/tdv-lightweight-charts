import { convertTime } from '../api/data-layer';

import { merge } from '../helpers/strict-type-checks';

import { CustomRectangleView } from '../views/pane/custom-rectangle-pane-view';
import { IPaneView } from '../views/pane/ipane-view';

import { Coordinate } from './coordinate';
import { Series } from './series';
import { Time } from './time-data';

export interface RectangleOptions {
	id?: string;
	fillColor: string;
	borderColor: string;
	fromPrice: number;
	toPrice: number;
	fromTime: Time;
	toTime: Time;
}

export type CreateRectangleOptions = Partial<RectangleOptions>;

export class CustomRectangle {
	private readonly _series: Series;
	private readonly _rectangleView: CustomRectangleView;
	private readonly _options: RectangleOptions;

	public constructor(series: Series, options: RectangleOptions) {
		this._series = series;
		this._options = options;
		this._rectangleView = new CustomRectangleView(series, this);
	}

	public applyOptions(options: Partial<RectangleOptions>): void {
		merge(this._options, options);
		// this.update();
		this._series.model().lightUpdate();
	}

	public options(): RectangleOptions {
		return this._options;
	}

	public paneView(): IPaneView {
		return this._rectangleView;
	}

	public update(): void {
		this._rectangleView.update();
	}

	public x0Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const timeRange = timeScale.visibleTimeRange();
		let fromTime = this._options.fromTime;

		if (timeRange && Number(timeRange.from.timestamp) > Number(this._options.fromTime)) {
			fromTime = timeRange.from.timestamp;
		}

		return this._convertTime(fromTime);
	}

	public y0Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const firstValue = series.firstValue();
		if (firstValue === null) {
			return null;
		}

		// const priceRange = priceScale.priceRange();
		const fromPrice = this._options.fromPrice;

		// if (priceRange && priceRange?.minValue() > fromPrice) {
			// fromPrice = priceRange.minValue();
		// }

		return priceScale.priceToCoordinate(fromPrice, firstValue.value);
	}

	public x1Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const logicRange = timeScale.visibleLogicalRange();

		if (!logicRange) {
			return null;
		}

		const timeRange = timeScale.visibleTimeRange();
		const right = logicRange.right().valueOf() as Coordinate;
		let toTime = this._options.toTime;

		if (timeRange && Number(timeRange.to.timestamp) < Number(this._options.toTime)) {
			toTime = timeRange.to.timestamp;
		}

		return this._convertTime(toTime) || right;
	}

	public y1Coord(): Coordinate | null {
		const series = this._series;
		const priceScale = series.priceScale();
		const timeScale = series.model().timeScale();

		if (timeScale.isEmpty() || priceScale.isEmpty()) {
			return null;
		}

		const firstValue = series.firstValue();
		if (firstValue === null) {
			return null;
		}

		// const priceRange = priceScale.priceRange();
		const toPrice = this._options.toPrice;

		// if (priceRange && priceRange?.maxValue() < toPrice) {
			// toPrice = priceRange.maxValue();
		// }

		return priceScale.priceToCoordinate(toPrice, firstValue.value);
	}

	private _convertTime(time: Time): Coordinate | null {
		const timePoint = convertTime(time);
		const timeScale = this._series.model().timeScale();
		const timePointIndex = timeScale.timeToIndex(timePoint, false);
		if (timePointIndex === null) {
			return null;
		}

		return timeScale.indexToCoordinate(timePointIndex);
	}
}
