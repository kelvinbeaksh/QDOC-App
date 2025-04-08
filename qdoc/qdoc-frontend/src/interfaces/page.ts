export interface IPageData {
  title?: string;
  loaded?: boolean;
  breadcrumbs?: IBreadcrumb[];
  fulFilled?: boolean;
}

export interface IBreadcrumb {
  title: string;
  route?: string;
}
