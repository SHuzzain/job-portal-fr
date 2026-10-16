type JobsLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function WorkspaceJobsLayout({
  children,
  modal,
}: JobsLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
