import React, { Component } from 'react'
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card, Table, Button, Select } from 'antd';
import { invoiceData } from './invoiceData';
import Qr from '../../../../assets/svg/Qr.png';
import NumberFormat from 'react-number-format';

const { Column } = Table;
const { Option } = Select;

export class Invoice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			template: 'rendertemplate'
		};
	}

	total() {
		let total = 0;
		invoiceData.forEach((elm) => {
			total += elm.price;
		})
		return total
	}


	renderModernTemplate = () => {
		return (
			<div className="bg-white p-6">
				{/* Header with gradient background */}
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 mb-6 rounded-lg">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl text-gray-700">Invoice</h1>
						<div className="flex items-center">
							{/* <img src="/img/brain-icon.png" alt="Brain" className="h-8" /> */}
							<span className="text-xl ml-2 text-indigo-500">Nexis Vision</span>
						</div>
					</div>
				</div>

				{/* Company & Invoice Details */}
				<div className="flex justify-between mb-8">
					<div>
						<h2 className="font-bold text-lg mb-1">Dreamguys Technologies PVT Ltd</h2>
						<p className="text-gray-600">Address: 15 Hodges Mews,High Wycomb HP123JL,United Kingdom</p>
					</div>
					<div className="text-right">
						<p>Invoice No:#005</p>
						<p>Invoice Date : 07-10-2023</p>
					</div>
				</div>

				{/* Customer Info Section */}
				<div className="mb-8">
					<div className="bg-gray-50 p-2 mb-4">
						<h3 className="text-gray-700">Customer Info</h3>
					</div>

					<div className="grid grid-cols-3 gap-x-20 gap-y-4">
						<div>
							<p className="text-gray-600 mb-2">Invoice To :</p>
							<p>Walter Roberson</p>
							<p>299 Star Trek Drive, Panama City,</p>
							<p>Florida, 32405,</p>
							<p>USA.</p>
						</div>
						<div>
							<p className="text-gray-600 mb-2">Pay To :</p>
							<p>Walter Roberson</p>
							<p>299 Star Trek Drive, Panama City,</p>
							<p>Florida, 32405,</p>
							<p>USA.</p>
						</div>
						<div className="text-left bg-gray-100 p-3">
							<p className="text-gray-600">Due Date</p>
							<p>07/23/2023</p>
							<div className="text-left">
								<p className="text-gray-600">Payment Status</p>
								<p className="text-blue-500">NOT PAID</p>
							</div>
						</div>
					</div>
				</div>

				{/* Items Table */}
				<div className="mt-4">
					<Table dataSource={invoiceData} pagination={false} className="mb-5">
						<Column title="No." dataIndex="key" key="key" />
						<Column title="Product" dataIndex="product" key="product" />
						<Column title="Quantity" dataIndex="quantity" key="quantity" />
						<Column title="Price"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round(text.price * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="price"
						/>
						<Column
							title="Total"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="total"
						/>
					</Table>
					<div className="d-flex justify-content-end">
						<div className="text-center">
							<div className="border-bottom">
								<p className="mb-2">
									<span>Sub - Total amount: </span>
									<NumberFormat
										displayType={'text'}
										value={(Math.round((this.total()) * 100) / 100).toFixed(2)}
										prefix={'$'}
										thousandSeparator={true}
									/>
								</p>
								<p>vat (10%) : {(Math.round(((this.total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat
									displayType={'text'}
									value={((Math.round((this.total()) * 100) / 100) - (this.total() / 100) * 10).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
				</div>

				{/* Footer Section */}
				<div className="grid grid-cols-2 gap-8">
					<div className="flex gap-4">
						<div className='flex'>
							<img src={Qr} alt="Image not show" className='w-28 h-28' />
						</div>
						<div>
							<h4 className="font-medium mb-2">Payment Info:</h4>
							<p>Debit Card : 465 ************645</p>
							<p>Amount : $1,815</p>
							<p className="text-sm text-gray-500 mt-1">Scan to View Receipt</p>
						</div>
					</div>
					<div>
						<h4 className="font-medium mb-2">Terms & Conditions:</h4>
						<ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
							<li>This is a GST based invoice bill,Which is applicable for TDS Deduction</li>
							<li>We are not the manufactures, company will stand for warranty as per their terms and conditions.</li>
						</ol>
					</div>
				</div>

				<div className="text-center mt-8">
					<p>Thanks for your Business</p>
				</div>
			</div>
		);
	};

	renderTemplate = () => {
		return (
			<div className="bg-white rounded-lg shadow-lg p-8">

				<div className="d-md-flex justify-content-md-between">
					<div className='text-left'>
						<span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
						<address>
							<p>
								{/* <span className="font-weight-semibold text-dark font-size-md">Emilus, Inc.</span><br /> */}
								<span>9498 Harvard Street</span><br />
								<span>Fairfield, Chicago Town 06824</span><br />
								<abbr className="text-dark" title="Phone">Phone:</abbr>
								<span>(123) 456-7890</span>
							</p>
						</address>
					</div>
					<div className="mt-3 text-left">
						<h2 className="mb-1 font-weight-semibold">Invoice #9972</h2>
						<p>25/7/2018</p>
						<address>
							<p>
								<span className="font-weight-semibold text-dark font-size-md">Genting Holdings.</span><br />
								<span>8626 Maiden Dr. </span><br />
								<span>Niagara Falls, New York 14304</span>
							</p>
						</address>
					</div>
				</div>
				<div className="mt-4">
					<Table dataSource={invoiceData} pagination={false} className="mb-5">
						<Column title="No." dataIndex="key" key="key" />
						<Column title="Product" dataIndex="product" key="product" />
						<Column title="Quantity" dataIndex="quantity" key="quantity" />
						<Column title="Price"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round(text.price * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="price"
						/>
						<Column
							title="Total"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="total"
						/>
					</Table>
					<div className="d-flex justify-content-end">
						<div className="text-center">
							<div className="border-bottom">
								<p className="mb-2">
									<span>Sub - Total amount: </span>
									<NumberFormat
										displayType={'text'}
										value={(Math.round((this.total()) * 100) / 100).toFixed(2)}
										prefix={'$'}
										thousandSeparator={true}
									/>
								</p>
								<p>vat (10%) : {(Math.round(((this.total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat
									displayType={'text'}
									value={((Math.round((this.total()) * 100) / 100) - (this.total() / 100) * 10).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
					<p className="mt-5">
						<small>
							In exceptional circumstances, Financial Services can provide an urgent manually processed special cheque.
							Note, however, that urgent special cheques should be requested only on an emergency basis as manually
							produced cheques involve duplication of effort and considerable staff resources. Requests need to be
							supported by a letter explaining the circumstances to justify the special cheque payment
						</small>
					</p>
				</div>
				{/* <hr className="d-print-none"/> */}
				{/* <div className="text-right d-print-none">
						<div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
							
							<div className="space-x-4">
								<Button type="primary" onClick={() => window.print()}>
									<PrinterOutlined />
									<span className="ml-1">Print</span>
								</Button>
								<Button type="primary" >
									<DownloadOutlined />
									<span className="ml-1">Download</span>
								</Button>
							</div>
						</div> 
						
					</div>*/}
			</div>
		)
	}


	renderClassicTemplate = () => {
		return (
			<div className="bg-white p-8 border-2 border-gray-200">
				{/* Header Section */}
				<div className="flex flex-col items-center mb-8 text-center">
					{/* <img src="/img/logo.png" alt="Kanakku" className="h-16 w-16 mb-4" /> */}
					<span className="text-2xl font-bold text-indigo-600">Nexis Vision</span>
					<div className="text-gray-600 mt-2">
						<p>Invoice No: #005</p>
						<p>Invoice Date: 07-10-2023</p>
						<p>Due Date: 07-12-2023</p>
					</div>
				</div>

				{/* Address Grid */}
				<div className="grid grid-cols-2 gap-8 mb-8">
					<div className="border-r pr-8 text-left">
						<h3 className="text-lg font-serif mb-2">From:</h3>
						<div className="text-gray-600">
							<p className="font-semibold">Dreamguys Technologies Pvt Ltd</p>
							<p>15 Hodges Mews</p>
							<p>High Wycombe HP12 3JL</p>
							<p>United Kingdom</p>
						</div>
					</div>
					<div className="text-left">
						<h3 className="text-lg font-serif mb-2">Bill To:</h3>
						<div className="text-gray-600">
							<p className="font-semibold">John Williams</p>
							<p>Star Trek Drive</p>
							<p>Panama City 299</p>
							<p>Florida, 32405, USA</p>
						</div>
					</div>
				</div>

				<div className="mt-4">
					<Table dataSource={invoiceData} pagination={false} className="mb-5">
						<Column title="No." dataIndex="key" key="key" />
						<Column title="Product" dataIndex="product" key="product" />
						<Column title="Quantity" dataIndex="quantity" key="quantity" />
						<Column title="Price"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round(text.price * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="price"
						/>
						<Column
							title="Total"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="total"
						/>
					</Table>
					<div className="d-flex justify-content-end">
						<div className="text-center">
							<div className="border-bottom">
								<p className="mb-2">
									<span>Sub - Total amount: </span>
									<NumberFormat
										displayType={'text'}
										value={(Math.round((this.total()) * 100) / 100).toFixed(2)}
										prefix={'$'}
										thousandSeparator={true}
									/>
								</p>
								<p>vat (10%) : {(Math.round(((this.total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat
									displayType={'text'}
									value={((Math.round((this.total()) * 100) / 100) - (this.total() / 100) * 10).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
					<p className="mt-5">
						<small>
							In exceptional circumstances, Financial Services can provide an urgent manually processed special cheque.
							Note, however, that urgent special cheques should be requested only on an emergency basis as manually
							produced cheques involve duplication of effort and considerable staff resources. Requests need to be
							supported by a letter explaining the circumstances to justify the special cheque payment
						</small>
					</p>
				</div>
			</div>
		);
	};

	renderMinimalTemplate = () => {
		return (
			<div className="bg-white p-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-12">
					<div className='text-left'>
						<h1 className="text-4xl font-light text-gray-700">INVOICE</h1>
						<p className="text-gray-500 mt-1">#005</p>
					</div>
					{/* <img src="/img/logo.png" alt="Kanakku" className="h-8" /> */}
				</div>

				{/* Dates & Addresses */}
				<div className="grid grid-cols-2 gap-12 mb-12">
					<div className='text-left'>
						<h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-semibold">From</h3>
						<p className="font-medium">Dreamguys Technologies Pvt Ltd</p>
						<p className="text-gray-600">15 Hodges Mews</p>
						<p className="text-gray-600">High Wycombe HP12 3JL, UK</p>
					</div>
					<div className='text-left'>
						<h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-semibold">Bill To</h3>
						<p className="font-medium">John Williams</p>
						<p className="text-gray-600">Star Trek Drive</p>
						<p className="text-gray-600">Panama City 299, Florida</p>
					</div>
				</div>

				<div className="mt-4">
					<Table dataSource={invoiceData} pagination={false} className="mb-5">
						<Column title="No." dataIndex="key" key="key" />
						<Column title="Product" dataIndex="product" key="product" />
						<Column title="Quantity" dataIndex="quantity" key="quantity" />
						<Column title="Price"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round(text.price * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="price"
						/>
						<Column
							title="Total"
							render={(text) => (
								<NumberFormat
									displayType={'text'}
									value={(Math.round((text.price * text.quantity) * 100) / 100).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							)}
							key="total"
						/>
					</Table>
					<div className="d-flex justify-content-end">
						<div className="text-center">
							<div className="border-bottom">
								<p className="mb-2">
									<span>Sub - Total amount: </span>
									<NumberFormat
										displayType={'text'}
										value={(Math.round((this.total()) * 100) / 100).toFixed(2)}
										prefix={'$'}
										thousandSeparator={true}
									/>
								</p>
								<p>vat (10%) : {(Math.round(((this.total() / 100) * 10) * 100) / 100).toFixed(2)}</p>
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat
									displayType={'text'}
									value={((Math.round((this.total()) * 100) / 100) - (this.total() / 100) * 10).toFixed(2)}
									prefix={'$'}
									thousandSeparator={true}
								/>
							</h2>
						</div>
					</div>
					<p className="mt-5">
						<small>
							In exceptional circumstances, Financial Services can provide an urgent manually processed special cheque.
							Note, however, that urgent special cheques should be requested only on an emergency basis as manually
							produced cheques involve duplication of effort and considerable staff resources. Requests need to be
							supported by a letter explaining the circumstances to justify the special cheque payment
						</small>
					</p>
				</div>
			</div>
		);
	};

	render() {
		const { template } = this.state;

		const renderTemplate = () => {
			switch (template) {
				case 'rendertemplate':
					return this.renderTemplate();
				case 'modern':
					return this.renderModernTemplate();
				case 'classic':
					return this.renderClassicTemplate();
				case 'minimal':
					return this.renderMinimalTemplate();
				default:
					return this.renderModernTemplate();
			}
		};

		return (
			<div className="container">

				<div className="text-left d-print-none">
					<div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
						<Select
							defaultValue={this.state.template}
							onChange={(value) => this.setState({ template: value })}
							className="w-48"
						>
							<Option value="rendertemplate">Render Template</Option>
							<Option value="modern">Modern Template</Option>
							<Option value="classic">Classic Template</Option>
							<Option value="minimal">Minimal Template</Option>
						</Select>

						<div className="space-x-4">
							<Button type="primary" onClick={() => window.print()}>
								<PrinterOutlined />
								<span className="ml-1">Print</span>
							</Button>
							<Button type="primary" onClick={() => {/* Add download logic */ }}>
								<DownloadOutlined />
								<span className="ml-1">Download</span>
							</Button>
						</div>
					</div>

					{/* Invoice Content */}
					<div className="max-w-6xl mx-auto">
						{renderTemplate()}
					</div>
				</div>
			</div>
		);
	}
}

export default Invoice


