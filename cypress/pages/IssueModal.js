class IssueModal {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = ".ql-editor";
    this.assignee = '[data-testid="select:userIds"]';
    this.reporter = '[data-testid="select:reporter"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = "Delete issue";
    this.cancelDeletionButtonName = "Cancel";
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeButton = '[data-testid="icon:close"]';
    this.openTimeTracing = '[data-testid="icon:stopwatch"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.doneButtonName = "Done";
    this.plusButton = '[data-testid="icon:plus"]';
    this.timeSpentField = '[placeholder="Number"]';
    this.loggedTime = "logged";
    this.commentTextArea = 'textarea[placeholder="Add a comment..."]';
    this.issueComment = '[data-testid="issue-comment"]';
    this.editButton = "Edit";
    this.saveButton = "Save";
    this.deleteCommentButton = "Delete";
    this.confirmCommentDeletionButton = "Delete comment";
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click("bottomRight");
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger("mouseover")
      .trigger("click");
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click("bottomRight");
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).type(title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should("not.exist");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountIssues)
          .first()
          .find("p")
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should("be.visible");
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("be.visible");
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("not.exist");
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should("be.visible");
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.backlogList).should("be.visible");
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.cancelDeletionButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.issueDetailModal).should("be.visible");
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal).get(this.closeButton).first().click();
    cy.get(this.issueDetailModal).should("not.exist");
  }

  clickTimeTracking() {
    cy.get(this.openTimeTracing).click();
    cy.get(this.timeTrackingModal).should("be.visible");
  }

  logTime(issueDetails) {
    cy.get(this.timeSpentField).eq(1).clear().type(issueDetails.timeSpent);
    cy.get(this.timeTrackingModal).within(() => {
      cy.contains(this.doneButtonName).click();
    });
  }
  ensureTimeIsLogged(issueDetails) {
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(issueDetails.timeSpent + "h logged").should("be.visible");
    });
  }
  validateIssueVisibilityState(issueTitle, isVisible) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    if (isVisible) cy.contains(issueTitle).should("be.visible");
    if (!isVisible) cy.contains(issueTitle).should("not.exist");
  }

  addComment(newComment) {
    this.getIssueDetailModal().within(() => {
      cy.contains("Add a comment...").debounced("type", "m");
      cy.get(this.commentTextArea).clear().type(newComment);
      cy.contains(this.saveButton).click().should("not.exist");
    });
  }
  validateCommentState(commentText, isVisible) {
    cy.get(this.issueDetailModal).should("exist");
    if (isVisible) cy.contains(commentText).should("be.visible");
    if (!isVisible) cy.contains(commentText).should("not.exist");
  }
  editComment(oldComment, newComment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueComment)
        .first()
        .contains(this.editButton)
        .click()
        .should("not.exist");
      cy.get(this.commentTextArea)
        .should("contain", oldComment)
        .clear()
        .type(newComment);
      cy.contains(this.saveButton).click();
    });
  }

  confirmCommentDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.confirmCommentDeletionButton).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
  }

  deleteComment(comment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueComment)
        .first()
        .should("contain", comment)
        .contains(this.deleteCommentButton)
        .click();
    });
    cy.get(this.confirmationPopup).should("exist");
  }
  openIssue(issueDetails) {
    cy.get(this.issuesList)
      .first()
      .should("contain", issueDetails.title)
      .click();
    cy.get(this.issueDetailModal).should("be.visible");
  }
  getEstimatedInputField() {
    cy.contains("Original Estimate")
      .next()
      .children('input[placeholder="Number"]');
  }

  estimationChanging(time) {
    if (time > 0) {
      cy.get(this.timeSpentField).eq(0).clear().type(time).blur();
    } else {
      cy.get(this.timeSpentField).eq(0).clear().blur();
    }
  }

  ensureEstimationIsLogged(timeEstimated) {
    cy.get(this.issueDetailModal).within(() => {
      if (timeEstimated > 0) {
        cy.contains(timeEstimated + "h estimated").should("be.visible");
      } else {
        cy.contains(timeEstimated + "h estimated").should("not.exist");
      }
    });
  }
}

export default new IssueModal();
