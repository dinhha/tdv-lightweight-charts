import { BitmapCoordinatesRenderingScope } from 'fancy-canvas';

import { HoveredObject } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';

import { BitmapCoordinatesPaneRenderer } from './bitmap-coordinates-pane-renderer';
import { drawHorizontalLine, LineStyle, LineWidth, setLineStyle } from './draw-line';

export interface HorizontalRayRendererData {
	color: string;
	lineStyle: LineStyle;
	lineWidth: LineWidth;

	y: Coordinate;
	x0: Coordinate;
	x1?: Coordinate;

	visible?: boolean;
	externalId?: string;
}

const enum Constants { HitTestThreshold = 7, }

export class HorizontalRayRenderer extends BitmapCoordinatesPaneRenderer {
	private _data: HorizontalRayRendererData | null = null;

	public setData(data: HorizontalRayRendererData): void {
		this._data = data;
	}

	public hitTest(x: Coordinate, y: Coordinate): HoveredObject | null {
		if (!this._data?.visible) {
			return null;
		}

		const { y: itemY, x0: itemX0, x1: itemX1, lineWidth, externalId } = this._data;
		const testX1 = itemX1 != null && x <= itemX1 + Constants.HitTestThreshold || itemX1 === null;
		// add a fixed area threshold around line (Y + width) for hit test
		if (y >= itemY - lineWidth - Constants.HitTestThreshold && y <= itemY + lineWidth + Constants.HitTestThreshold &&
			itemX0 >= x - Constants.HitTestThreshold && testX1
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

		const y = Math.round(this._data.y * verticalPixelRatio);
		const x0 = Math.round(this._data.x0 * horizontalPixelRatio);
		let x1 = bitmapSize.width;
		
		if (this._data.x1) {
			x1 = Math.round(this._data.x1 * horizontalPixelRatio);
		}

		if (y < 0 || y > bitmapSize.height || x0 < 0 || x1 > bitmapSize.width) {
			return;
		}

		ctx.lineCap = 'butt';
		ctx.strokeStyle = this._data.color;
		ctx.lineWidth = Math.floor(this._data.lineWidth * horizontalPixelRatio);
		setLineStyle(ctx, this._data.lineStyle);
		drawHorizontalLine(ctx, y, x0, x1);
	}
}
