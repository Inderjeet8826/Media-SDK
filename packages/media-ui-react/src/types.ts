import { CSSProperties, ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export type RenderProp<TArgs, TReturn = ReactNode> = ((args: TArgs) => TReturn) | TReturn;
