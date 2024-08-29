import { BitmapCoordinatesRenderingScope } from 'fancy-canvas';

import { HoveredObject } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';

import { BitmapCoordinatesPaneRenderer } from './bitmap-coordinates-pane-renderer';

export interface RectangleRendererData {
	fillColor: string;
	borderColor: string;

	x0: Coordinate;
	y0: Coordinate;
	x1: Coordinate;
	y1: Coordinate;
	visible?: boolean;
	externalId?: string;
}

const enum Constants { HitTestThreshold = 7, }

export class RectangleRenderer extends BitmapCoordinatesPaneRenderer {
	private _data: RectangleRendererData | null = null;

	public setData(data: RectangleRendererData): void {
		this._data = data;
	}

	public hitTest(x: Coordinate, y: Coordinate): HoveredObject | null {
		if (!this._data?.visible) {
			return null;
		}

		const { x0, y0, x1, y1, externalId } = this._data;
		// add a fixed area threshold around line (Y + width) for hit test
		if (y >= y0 - Constants.HitTestThreshold && y <= y1 + Constants.HitTestThreshold &&
			x >= x0 - Constants.HitTestThreshold && x <= x1 + Constants.HitTestThreshold
		) {
			return {
				hitTestData: this._data,
				externalId: externalId,
			};
		}

		return null;
	}

	protected _drawImpl({ context: ctx, bitmapSize, horizontalPixelRatio, verticalPixelRatio }: BitmapCoordinatesRenderingScope): void {
		if (this._data === null) {
			return;
		}

		if (this._data.visible === false) {
			return;
		}

		const x0 = Math.round(this._data.x0 * horizontalPixelRatio);
		const y0 = Math.round(this._data.y0 * verticalPixelRatio);
		const x1 = Math.round(this._data.x1 * horizontalPixelRatio);
		const y1 = Math.round(this._data.y1 * verticalPixelRatio);

		if (x1 < 0 || x0 > bitmapSize.width || y1 < 0 || y0 > bitmapSize.height) {
			return;
		}

		// Draw the rectangle
		ctx.fillStyle = this._data.fillColor;
		ctx.strokeStyle = this._data.borderColor;

		ctx.beginPath();
		ctx.rect(x0, y0, x1 - x0, y1 - y0);
		ctx.fill();
		ctx.stroke();
	}
}
